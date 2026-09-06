import { Button } from '@/components/ui/button';
import ModeToggle from './mode-toggle';
import Link from 'next/link';
import { EllipsisVertical, ShoppingCart } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import UserButton from './user-button';

const Menu = () => {
  return (
    <div className='flex justify-end gap-3 bg-amber-100 text-black'>
      <nav className='hidden md:flex w-full align-middle items-center max-w-xs gap-1 pl-0.5 pr-0.75'>
        <ModeToggle />

        <Button asChild variant='ghost'>
          <Link href='/cart'>
            Cart
            <ShoppingCart />
          </Link>
        </Button>

        <UserButton />
      </nav>

      {/* Sheet (npx shadcn@latest add sheet) */}
      <nav className='md:hidden  text-black'>
        <Sheet>
          <SheetTrigger className='align-middle'>
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className='flex flex-col items-start text-black'>
            <SheetTitle>Menu</SheetTitle>
            <ModeToggle />
            <Button asChild variant='ghost'>
              <Link href='/cart'>
                {/* <div className='mt-0.5> */}
                <ShoppingCart className='mt-0.5' /> Cart
                {/* </div> */}
              </Link>
            </Button>
            <UserButton />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
