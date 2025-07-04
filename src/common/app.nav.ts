import type { FunctionComponent } from 'react';

// App icons
import CallIcon from '@mui/icons-material/Call';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import DifferenceOutlinedIcon from '@mui/icons-material/DifferenceOutlined';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import EventNoteIcon from '@mui/icons-material/EventNote';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import GrainIcon from '@mui/icons-material/Grain';
import ImageIcon from '@mui/icons-material/Image';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import IosShareIcon from '@mui/icons-material/IosShare';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
// Link icons
import GitHubIcon from '@mui/icons-material/GitHub';
import { DiscordIcon } from '~/common/components/icons/3rdparty/DiscordIcon';
// Modal icons
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import SettingsIcon from '@mui/icons-material/Settings';


import { Brand } from '~/common/app.config';
import { ChatBeamIcon } from '~/common/components/icons/ChatBeamIcon';
import { PhChats } from '~/common/components/icons/phosphor/PhChats';
import { PhChatsDuotone } from '~/common/components/icons/phosphor/PhChatsDuotone';
import { hasNoChatLinkItems } from '~/modules/trade/link/store-share-link';


// enable to show all items, for layout development
const SHOW_ALL_APPS = false;

const SPECIAL_DIVIDER = '__DIVIDER__';


// Nav items

interface ItemBase {
  name: string,
  icon: FunctionComponent,
  iconActive?: FunctionComponent,
  tooltip?: string,
}

export interface NavItemApp extends ItemBase {
  type: 'app',
  mobileName?: string,
  route: string,
  landingRoute?: string,  // specify a different route than the nextjs page router route, to land to
  barTitle?: string,      // set to override the name as the bar title (unless custom bar content is used)
  hideOnMobile?: boolean, // set to true to hide the icon on mobile, unless this is the active app
  hideIcon?: boolean
    | (() => boolean),    // set to true to hide the icon, unless this is the active app
  hideBar?: boolean,      // set to true to hide the page bar
  hideDrawer?: boolean,   // set to true to hide the drawer
  panelAsMenu?: boolean,  // set to true to use the popup menu as the panel
  hideNav?: boolean
    | (() => boolean),    // set to hide the Nav bar (note: must have a way to navigate back)
  fullWidth?: boolean,    // set to true to override the user preference
  pageBrighter?: boolean, // set to true to make the page brighter (.surface instead of .level1)
  isDev?: boolean,        // show a 'dev mode' badge
  _delete?: boolean,      // delete from the UI
}

export interface NavItemModal extends ItemBase {
  type: 'modal',
  overlayId: 'settings' | 'models',
}

export interface NavItemExtLink extends ItemBase {
  type: 'extLink',
  href: string,
}

// interface MenuItemAction extends ItemBase {
//   type: 'action',
//   action: () => void,
// }


export const navItems: {
  apps: NavItemApp[],
  modals: NavItemModal[],
  links: NavItemExtLink[],
} = {

  // User-chosen apps
  apps: [
    {
      name: 'Chat',
      icon: PhChats, // was: TextsmsOutlinedIcon
      iconActive: PhChatsDuotone, // was: TextsmsIcon
      type: 'app',
      route: '/',
    },
    {
      name: 'Call',
      barTitle: 'Voice Calls',
      icon: CallOutlinedIcon,
      iconActive: CallIcon,
      type: 'app',
      route: '/call',
      hideDrawer: true,
      panelAsMenu: true,
      fullWidth: true,
    },
    // {
    //   name: 'Draw',
    //   icon: FormatPaintOutlinedIcon,
    //   iconActive: FormatPaintTwoToneIcon,
    //   type: 'app',
    //   route: '/draw',
    //   hideDrawer: true,
    //   // hideOnMobile: true,
    //   // isDev: true,
    //   _delete: true, // FIXME: not yet ready for prime time
    // },
    // {
    //   name: 'Cortex',
    //   icon: AutoAwesomeOutlinedIcon,
    //   iconActive: AutoAwesomeIcon,
    //   type: 'app',
    //   route: '/cortex',
    //   isDev: true,
    //   _delete: true,
    // },
    // {
    //   name: 'Patterns',
    //   icon: AccountTreeOutlinedIcon,
    //   iconActive: AccountTreeTwoToneIcon,
    //   type: 'app',
    //   route: '/patterns',
    //   isDev: true,
    //   _delete: true, // FIXME: not even begun
    // },
    // {
    //   name: 'Workspace',
    //   icon: WorkspacesOutlinedIcon,
    //   iconActive: WorkspacesIcon,
    //   type: 'app',
    //   route: '/workspace',
    //   hideDrawer: true,
    //   hideOnMobile: true,
    //   isDev: true,
    //   _delete: true, // FIXME: the all-in-one, not even begun
    // },
    // <-- divider here -->
    {
      name: SPECIAL_DIVIDER,
      type: 'app',
      route: SPECIAL_DIVIDER,
      icon: () => null,
    },
    {
      name: 'Create Personas',
      mobileName: 'Personas',
      icon: Diversity2Icon, // was: Outlined.. but they look the same
      // iconActive: Diversity2Icon,
      type: 'app',
      route: '/personas',
      hideBar: true,
    },
    {
      name: 'Compare Text',
      barTitle: 'Comparison',
      icon: DifferenceOutlinedIcon,
      type: 'app',
      route: '/diff',
      hideDrawer: true,
      hideOnMobile: true,
    },
    {
      name: 'Tokenize Text',
      barTitle: 'Tokenization',
      icon: GrainIcon,
      type: 'app',
      route: '/tokens',
      hideDrawer: true,
      hideOnMobile: true,
      hideIcon: true,
      isDev: true,
    },
    {
      name: 'Beam',
      icon: ChatBeamIcon,
      type: 'app',
      route: '/dev/beam',
      hideDrawer: true,
      hideIcon: true,
      isDev: true,
    },
    {
      name: 'Media Library',
      icon: ImageOutlinedIcon,
      iconActive: ImageIcon,
      type: 'app',
      route: '/media',
      isDev: true,
      _delete: true,
    },
    {
      name: 'Shared Chats',
      barTitle: 'Shared Chat',
      icon: IosShareOutlinedIcon,
      iconActive: IosShareIcon,
      type: 'app',
      route: '/link/chat/[chatLinkId]',
      landingRoute: '/link/chat/list',
      hideOnMobile: true,
      panelAsMenu: true,
      hideIcon: hasNoChatLinkItems,
      hideNav: hasNoChatLinkItems,
    },
    {
      name: 'News',
      icon: EventNoteOutlinedIcon,
      iconActive: EventNoteIcon,
      type: 'app',
      route: '/news',
      hideBar: true,
      hideDrawer: true,
      hideOnMobile: true,
    },
  ],

  // Modals
  modals: [
    {
      name: 'Configure AI Models',
      icon: BuildCircleIcon,
      type: 'modal',
      overlayId: 'models',
    },
    {
      name: 'App Preferences',
      icon: SettingsIcon,
      type: 'modal',
      overlayId: 'settings',
    },
  ],

  // External links
  links: [
    // {
    //   type: 'extLink',
    //   name: 'X',
    //   icon: TwitterIcon,
    //   href: 'https://twitter.com',
    // },
    {
      type: 'extLink',
      name: 'Discord',
      icon: DiscordIcon,
      href: Brand.URIs.SupportInvite,
    },
    {
      type: 'extLink',
      name: 'GitHub',
      icon: GitHubIcon,
      href: Brand.URIs.OpenRepo,
    },
  ],

};

// apply UI filtering right away - do it here, once, and for all
navItems.apps = navItems.apps.filter(app => !app._delete || SHOW_ALL_APPS);

export function checkDivider(app?: NavItemApp) {
  return app?.name === SPECIAL_DIVIDER;
}

export function checkVisibileIcon(app: NavItemApp, isMobile: boolean, currentApp?: NavItemApp) {
  return app.hideOnMobile && isMobile ? false : app === currentApp ? true : typeof app.hideIcon === 'function' ? !app.hideIcon() : !app.hideIcon;
}

export function checkVisibleNav(app?: NavItemApp) {
  return !app ? false : typeof app.hideNav === 'function' ? !app.hideNav() : !app.hideNav;
}