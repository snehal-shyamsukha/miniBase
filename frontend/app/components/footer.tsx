import Image from "next/image";
const socialItems=[
    {label:"insta",img:"/insta.png",link:""},
    {label:"discord",img:"/dis.png",link:""},
    {label:"twitter",img:"/x.png",link:""},
    {label:"farcaster",img:"/farcaster.png",link:""},
    {label:"mail",img:"/mail.png"}
]
export default function footer(){
return(
    <div className=" relative flex flex-row items-center justify-center space-x-8 pb-4 z-10">
        {socialItems.map((item,index)=>(
            <div>
                          <Image
          src={item.img}
          alt="Logo"
          width={43.131}
          height={43.131}
          className="mt-2"
        />

            </div>
        ))
        }
    </div>
)
}