import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import {
  XMarkIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Link } from '@tanstack/react-router';
import { menus } from '../../../constants/layouts/menuConstants';

const handleInactiveClick = (e: React.MouseEvent) => {
  e.preventDefault();
  alert('We are constructing a page. Please wait for your wonderful experiences.');
};

export const DesktopMenu = () => {
  return (
    <PopoverGroup className="hidden lg:flex lg:gap-x-12">
      {menus.map((menu) => {
        if (menu.subCategories) {
          return (
            <Popover key={menu.name}>
              <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold text-gray-900">
                {menu.name}
                <ChevronDownIcon className="size-5 text-gray-400" />
              </PopoverButton>

              <PopoverPanel transition className="absolute inset-x-0 top-0 -z-10 bg-white pt-20 shadow-lg ring-1 ring-gray-900/5">
                <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-4 px-6 py-10 lg:px-8">
                  {menu.subCategories.map((item) => (
                    <div key={item.name} className="group relative rounded-lg p-6 text-sm hover:bg-gray-50">
                      <div className="flex size-11 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <item.icon className="size-6 text-gray-600 group-hover:text-indigo-600" />
                      </div>
                      <div className="mt-6">
                        <a 
                          href={item.inactive ? '#' : `${menu.basePath || ''}${item.path || ''}`} 
                          onClick={item.inactive ? handleInactiveClick : undefined}
                          className="font-semibold text-gray-900 flex items-center gap-1"
                        >
                          {item.name}
                          {item.inactive && <WrenchScrewdriverIcon className="size-4 text-orange-500" title="Under Construction" />}
                          <span className="absolute inset-0" />
                        </a>
                        <p className="mt-1 text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {menu.callsToAction && menu.callsToAction.length > 0 && (
                  <div className="bg-gray-50">
                    <div className={`mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-${menu.callsToAction.length} divide-x divide-gray-900/5 border-x border-gray-900/5`}>
                      {menu.callsToAction.map((item) => (
                        <a 
                          key={item.name} 
                          href={item.inactive ? '#' : `${menu.basePath || ''}${item.path || ''}`} 
                          onClick={item.inactive ? handleInactiveClick : undefined}
                          className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                        >
                          <item.icon className="size-5 text-gray-400" />
                          {item.name}
                          {item.inactive && <WrenchScrewdriverIcon className="size-4 text-orange-500" title="Under Construction" />}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </PopoverPanel>
            </Popover>
          );
        } else {
          return (
            <a 
              key={menu.name} 
              href={menu.inactive ? '#' : menu.path || '#'} 
              onClick={menu.inactive ? handleInactiveClick : undefined}
              className="text-sm/6 font-semibold text-gray-900 flex items-center gap-1"
            >
              {menu.name}
              {menu.inactive && <WrenchScrewdriverIcon className="size-4 text-orange-500" title="Under Construction" />}
            </a>
          );
        }
      })}
    </PopoverGroup>
  );
};

export const MobileMenu = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  isLoggedIn,
  userName,
  handleLogout,
}: {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isLoggedIn: boolean;
  userName: string | null;
  handleLogout: () => void;
}) => {
  return (
    <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
      <div className="fixed inset-0 z-50" />
      <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              alt=""
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              className="h-8 w-auto"
            />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
              {menus.map((menu) => {
                if (menu.subCategories) {
                  return (
                    <Disclosure as="div" className="-mx-3" key={menu.name}>
                      <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                        {menu.name}
                        <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />
                      </DisclosureButton>
                      <DisclosurePanel className="mt-2 space-y-2">
                        {[...menu.subCategories, ...(menu.callsToAction || [])].map((item) => (
                          <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.inactive ? '#' : `${menu.basePath || ''}${item.path || ''}`}
                            onClick={item.inactive ? handleInactiveClick : undefined}
                            className="flex items-center gap-1 rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                          >
                            {item.name}
                            {item.inactive && <WrenchScrewdriverIcon className="size-4 text-orange-500" title="Under Construction" />}
                          </DisclosureButton>
                        ))}
                      </DisclosurePanel>
                    </Disclosure>
                  );
                } else {
                  return (
                    <a 
                      key={menu.name} 
                      href={menu.inactive ? '#' : menu.path || '#'} 
                      onClick={menu.inactive ? handleInactiveClick : undefined}
                      className="-mx-3 flex items-center gap-1 rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      {menu.name}
                      {menu.inactive && <WrenchScrewdriverIcon className="size-5 text-orange-500" title="Under Construction" />}
                    </a>
                  );
                }
              })}
            </div>
            <div className="py-6">
              {isLoggedIn ? (
                <>
                  <div className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900">
                    Hello, {userName}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 w-full text-left"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                    Log in
                  </Link>
                  <Link to="/" className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  );
};
