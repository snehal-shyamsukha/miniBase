// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MiniBase is ReentrancyGuard {
    IERC20 public usdcToken;
    address public constant owner = payable(0xD07D389EAb22F37F17a82AA139402b90B33dBFa0);

    struct Bet {
        uint256 amount;
        address bettor;
    }

    struct ParticipantData {
        Bet[] bets;
        uint256 totalBetAmount;
    }

    struct Tournament {
        address tournamentOwner;
        address[] participants;
        uint256 deadline;
        bool settled;
        address winner;
        uint256 totalPool;
        mapping(address => ParticipantData) participantData;
        uint256 maxPlayer;
    }

    mapping(uint256 => Tournament) public tournaments;

    event TournamentCreated(uint256 tournamentId, string name, uint256 deadline);
    event ParticipantAdded(uint256 tournamentId, address participant);
    event BetPlaced(uint256 tournamentId, address participant, address bettor, uint256 amount);
    event TournamentSettled(uint256 tournamentId, address winner);

    error DeadlineInPast();
    error ParticipantsRequired();
    error InvalidParticipant();
    error BettingClosed();
    error TournamentAlreadySettled();
    error ZeroBetAmount();
    error TransferFailed();
    error NoBetsOnWinner();
    error YouAreNotOwner(address owner, address caller);
    error TournamentFull();

    constructor(address _usdcAddress) {
        usdcToken = IERC20(_usdcAddress);
    }

    function createTournament(
        string memory _name,
        uint256 _deadline,
        uint256 tournamentId,
        uint256 maxPlayer
    ) external {
        if (_deadline <= block.timestamp) {
            revert DeadlineInPast();
        }

        Tournament storage tournament = tournaments[tournamentId];
        tournament.deadline = _deadline;
        tournament.settled = false;
        tournament.totalPool = 0;
        tournament.tournamentOwner = msg.sender;
        tournament.maxPlayer = maxPlayer;

        emit TournamentCreated(tournamentId, _name, _deadline);
    }

    function addParticipant(uint256 _tournamentId, address _participant) external {
        Tournament storage tournament = tournaments[_tournamentId];

        if(tournament.maxPlayer==tournament.participants.length){
            revert TournamentFull();
        }
        if (_participant == address(0)) {
            revert InvalidParticipant();
        }

        tournament.participantData[_participant].totalBetAmount = 0;
        tournament.participants.push(_participant);

        emit ParticipantAdded(_tournamentId, _participant);
    }

    function placeBet(uint256 _tournamentId, address _participant, uint256 _amount) external nonReentrant {
        Tournament storage tournament = tournaments[_tournamentId];

        if (block.timestamp >= tournament.deadline) {
            revert BettingClosed();
        }

        if (tournament.settled) {
            revert TournamentAlreadySettled();
        }

        if (tournament.participantData[_participant].totalBetAmount == 0 && _participant == address(0)) {
            revert InvalidParticipant();
        }

        if (_amount == 0) {
            revert ZeroBetAmount();
        }

        if (!usdcToken.transferFrom(msg.sender, address(this), _amount)) {
            revert TransferFailed();
        }

        Bet memory newBet = Bet({
            amount: _amount,
            bettor: msg.sender
        });

        tournament.participantData[_participant].bets.push(newBet);
        tournament.participantData[_participant].totalBetAmount += _amount;
        tournament.totalPool += _amount;

        emit BetPlaced(_tournamentId, _participant, msg.sender, _amount);
    }

    function settleTournament(uint256 _tournamentId, address _winningParticipant) external nonReentrant {
        Tournament storage tournament = tournaments[_tournamentId];

        if (block.timestamp < tournament.deadline) {
            revert BettingClosed();
        }

        if (tournament.settled) {
            revert TournamentAlreadySettled();
        }

        if (tournament.participantData[_winningParticipant].totalBetAmount == 0) {
            revert NoBetsOnWinner();
        }

        if (msg.sender != tournament.tournamentOwner && msg.sender != owner) {
            revert YouAreNotOwner(tournament.tournamentOwner, msg.sender);
        }

        tournament.settled = true;
        tournament.winner = _winningParticipant;

        ParticipantData storage winnerData = tournament.participantData[_winningParticipant];
        uint256 winnerTotalBet = winnerData.totalBetAmount;
        require(winnerTotalBet > 0, "No bets placed on winner");

        uint256 totalPool = tournament.totalPool;

        for (uint256 i = 0; i < winnerData.bets.length; i++) {
            Bet memory bet = winnerData.bets[i];
            uint256 payout = (bet.amount * totalPool) / winnerTotalBet;
            if (!usdcToken.transfer(bet.bettor, payout)) {
                revert TransferFailed();
            }
        }

        emit TournamentSettled(_tournamentId, _winningParticipant);
    }

    function getTournament(uint256 _tournamentId) external view returns (
        address[] memory participants,
        uint256 deadline,
        bool settled,
        address winner,
        uint256 totalPool
    ) {
        Tournament storage tournament = tournaments[_tournamentId];
        return (
            tournament.participants,
            tournament.deadline,
            tournament.settled,
            tournament.winner,
            tournament.totalPool
        );
    }

    function getParticipantTotalBet(uint256 _tournamentId, address _participant) external view returns (uint256) {
        Tournament storage tournament = tournaments[_tournamentId];
        return tournament.participantData[_participant].totalBetAmount;
    }

    function getParticipantBets(uint256 _tournamentId, address _participant) external view returns (uint256[] memory, address[] memory) {
        Tournament storage tournament = tournaments[_tournamentId];
        uint256 numberOfBets = tournament.participantData[_participant].bets.length;
        uint256[] memory amounts = new uint256[](numberOfBets);
        address[] memory bettors = new address[](numberOfBets);

        for (uint256 i = 0; i < numberOfBets; i++) {
            amounts[i] = tournament.participantData[_participant].bets[i].amount;
            bettors[i] = tournament.participantData[_participant].bets[i].bettor;
        }

        return (amounts, bettors);
    }

    function getTimeStamp() public view returns(uint256){
        return block.timestamp;
    }
}
