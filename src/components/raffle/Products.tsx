import { Fragment } from "react";
import Image from "next/image";

export default function RaffleProducts() {

  const product_images = [
    '/products/toxic-alien-water-pipe.jpg',
    '/products/jellyfish-perc-rig.jpg',
    '/products/puffco-peak-canyon.jpg',
  ];
    
  return (
    <div className="flex flex-row items-center gap-4">
      {product_images.map((image) => (
        <Fragment key={image}>
          <Image src={image} alt="Raffle Product" width={100} height={100} className="object-contain lg:h-48 w-full rounded-lg"/>
        </Fragment>
      ))}
    </div>
  );
}