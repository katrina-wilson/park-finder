import * as React from 'react'; 
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import trees from "../assets/trees.jpg";
import Login from '../components/Login';

function Landing() {

    const navigate = useNavigate();

    const [isLogin, setIsLogin] = React.useState(false);

    const handleLogin = (token: string) => {
        console.log("Registered! Token:", token);
        setIsLogin(false);

        navigate('/home');
    };

    return (
        <div 
            className='tw:flex tw:w-full tw:h-full tw:items-center tw:justify-center'
            style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${trees})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className='tw:flex tw:flex-col tw:items-center tw:justify-center tw:w-fit tw:h-fit tw:bg-white tw:rounded-2xl tw:shadow-2xl'>
                {!isLogin ? (
                    <div className='tw:max-w-2xl tw:p-16 tw:flex tw:flex-col tw:items-center'>
                        <div className='tw:text-3xl tw:font-bold tw:pb-6 playfair-font tw:uppercase' style={{ fontFamily: 'Playfair Display SC'}}>
                            Welcome to Triangle Trails!
                        </div>
                        <div className='tw:text-sm tw:text-gray-600 tw:italic tw:text-center'>
                            Find your next favorite park in the Triangle! <br/> Search, explore, and discover what each spot has to offer.
                        </div>

                        <div className='tw:flex tw:pt-12 tw:space-x-4 tw:items-center tw:justify-center tw:w-full'>
                            <Button
                                variant='outlined'
                                size='large'
                                className='tw:h-22'
                                onClick={() => navigate('/home')}
                            >
                                Explore as Guest
                            </Button>
                            <Button
                                variant='contained'
                                size='large'
                                className='tw:h-22'
                                onClick={() => setIsLogin(true)}
                            >
                                Login/Create an Account
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <Login
                            handleGoBack={() => setIsLogin(false)}
                            handleLogin={(token) => handleLogin(token)}
                        />
                    </>
                )}

            </div>
        </div>

    )
};

export default Landing;