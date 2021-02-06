import { Button } from 'antd';
import { Avatar, ChevronDownIcon, Menu, MenuIcon, Popover, Position } from 'evergreen-ui';
import { useContext } from 'react';
import GlobalContext from '../../store/globalContext';
import Navbrand from './Navbrand';

function Navbar() {
  const { state, actions } = useContext(GlobalContext);

  const { isLoggedIn, user } = state;
  return (
    <div className="w-full p-2 h-14 flex items-center justify-between px-24 shadow absolute opacity-100 bg-white tablet:px-10 smallTablet:px-5">
      <Navbrand />
      <div className="flex items-center space-x-10 text-green-700 font-medium smallTablet:hidden">
        <a href="/" className="hover:font-bold">
          HOME
        </a>
        <a href="/search" className="hover:font-bold">
          JOBS
        </a>
        <a href="/login" className={`hover:font-bold ${isLoggedIn && 'hidden'}`}>
          LOG IN
        </a>
        <a href="/signup" className={`hover:font-bold ${isLoggedIn && 'hidden'}`}>
          SIGN UP
        </a>
        <Popover
          position={Position.BOTTOM_RIGHT}
          content={
            <Menu>
              <Menu.Group>
                <Menu.Item onSelect={() => window.location.replace('/me')}>Profile</Menu.Item>
              </Menu.Group>
              <Menu.Divider />
              <Menu.Group>
                <Menu.Item
                  intent="danger"
                  onSelect={() => actions({ type: 'logout', payload: null })}
                >
                  Logout
                </Menu.Item>
              </Menu.Group>
            </Menu>
          }
        >
          <Button
            className={`flex justify-between items-center shadow-none border-none text-primary ${
              !isLoggedIn && 'hidden'
            } `}
            // appearance="minimal"
            type="link"
          >
            <Avatar
              isSolid
              src={user?.profilePicture}
              className="mr-2 my-1"
              name={user?.name || user?.firstname + ' ' + user?.lastname}
              size={30}
            />
            <p className="mr-1">{user?.firstname || user?.name}</p>
            <ChevronDownIcon />
          </Button>
        </Popover>
      </div>
      <Popover
        position={Position.BOTTOM_RIGHT}
        content={
          <Menu>
            <div
              className={`flex items-center shadow-none border-none mb-2 pl-4 pt-2 text-primary ${
                !isLoggedIn && 'hidden'
              } `}
            >
              <Avatar
                isSolid
                src={user?.profilePicture}
                className="mr-2 my-1"
                name={user?.name || user?.firstname + ' ' + user?.lastname}
                size={30}
              />
              <p className="mr-1">{user?.firstname || user?.name}</p>
            </div>
            <Menu.Group>
              {isLoggedIn && (
                <Menu.Item onSelect={() => window.location.replace('/me')}>Profile</Menu.Item>
              )}
              <Menu.Item onSelect={() => window.location.replace('/search')}>Jobs</Menu.Item>
              {!isLoggedIn && (
                <Menu.Item onSelect={() => window.location.replace('/login')}>Login</Menu.Item>
              )}
              {!isLoggedIn && (
                <Menu.Item onSelect={() => window.location.replace('/signup')}>Sign Up</Menu.Item>
              )}
            </Menu.Group>
            <Menu.Divider />
            {isLoggedIn && (
              <Menu.Group>
                <Menu.Item
                  intent="danger"
                  onSelect={() => actions({ type: 'logout', payload: null })}
                >
                  Logout
                </Menu.Item>
              </Menu.Group>
            )}
          </Menu>
        }
      >
        <Button
          className="hidden smallTablet:block"
          // appearance="minimal"
          type="link"
        >
          <MenuIcon />
        </Button>
      </Popover>
    </div>
  );
}

export default Navbar;
