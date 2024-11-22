import '../App.css';
import Navbar from '../navbar/navbar';
import { Outlet, Link } from "react-router-dom";

function Home() {
    return (
        <div className='background_img'>
            <Navbar />
            <header className="App-header">

            </header>
        </div>
    );
};
  
export default Home;