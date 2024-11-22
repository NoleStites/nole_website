import './navbar.css';
import { Outlet, Link } from "react-router-dom";

function NavItem({ name, route }) {
    return (
        <div className='dropdown'>
            <div className="nav_item">
                <Link to={route}>
                    <h1 className="item_name"> {/*This allows the nav item's name to be centered vertically*/}
                        {name}
                    </h1>
                </Link>
            </div>
        </div>
    );
}

function NavList ({ name, dropdown }) {
    return (
        <div className='dropdown'>
            <div className="nav_item">
                    <h1 className="item_name"> {/*This allows the nav item's name to be centered vertically*/}
                        {name}
                    </h1>
            </div>
            <div className='dropdown_content'>
                {
                    Object.entries(dropdown)
                    .map( ([item_name, url]) => <Link to={url}><p className='dropdown_item'>{item_name}</p></Link> )
                }
            </div>
        </div>
    );
}

function Navbar() {
    return (
        <div className="nav">
            <NavItem name={"Home"} route={"/"}/>
            <NavList name={"Projects"} dropdown={{"Minecraft Block Textures": "/minecraft", "Test 2": "URL2"}}/>
        </div>
    );
}

export default Navbar;