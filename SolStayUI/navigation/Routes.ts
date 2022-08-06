import CreateAccount from "../screens/CreateAccount";
import HomeScreen from "../screens/HomeScreen";
import ImportAccount from "../screens/ImportAccount";
import KeysScreen from "../screens/KeysScreen";
import RecoveryPhraseScreen from "../screens/RecoveryPhraseScreen";
import SettingsScreen from "../screens/SettingsScreen";
import StartupScreen from "../screens/StartupScreen";
import { IRouteProps } from "./RouteProp";

const routes: IRouteProps[] = [
    {
        name: 'Startup',
        component: StartupScreen,
    },
    {
        name:'CreateAccount',
        component: CreateAccount
    },
    {
        name:'ImportAccount',
        component: ImportAccount
    },
    {
        name:'RecoveryPhrase',
        component: RecoveryPhraseScreen
    },
    {
        name: 'Home',
        component: HomeScreen
    },
    {
        name:'Keys',
        component: KeysScreen
    },
    {
        name: 'Settings',
        component: SettingsScreen
    }
];

export default routes;