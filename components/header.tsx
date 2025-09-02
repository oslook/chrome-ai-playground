'use client';

import { FileText, Globe2, MessageSquare,Bot, RefreshCw, PenTool, HelpCircle } from 'lucide-react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { ModeToggle } from '@/components/mode-toggle';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Guide', href: '/guide', icon: HelpCircle },
  { name: 'Translate', href: '/translate', icon: Globe2 },
  { name: 'Summarize', href: '/summarize', icon: FileText },
  { name: 'Prompt', href: '/prompt', icon: MessageSquare },
  { name: 'Writer', href: '/writer', icon: PenTool },
  { name: 'ReWriter', href: '/rewriter', icon: RefreshCw },

];

export function Navigation() {
  const pathname = usePathname();

  return (
    <div className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Bot className="h-6 w-6" />
          <span className="font-bold text-lg">Chrome AI Playground</span>
        </Link>
        
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                        pathname === item.href && 'bg-accent text-accent-foreground'
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}