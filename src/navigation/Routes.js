import { NavigationContainer } from '@react-navigation/native'
import HomeStack from './HomeStack'
import AuthStack from './AuthStack'
import { useAuthContext } from './AuthProvider'

const Routes = () => {

    const { userId } = useAuthContext();

    return (
        <NavigationContainer>

            {userId ? (
                <>
                    <HomeStack />
                </>
            ) : (
                <>
                    <AuthStack />
                </>
            )}

        </NavigationContainer>
    )

}
export default Routes;