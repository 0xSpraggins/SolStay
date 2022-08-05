import CreateAccount from "../screens/CreateAccount";
import ImportAccount from "../screens/ImportAccount";
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
    }
];

export default routes;