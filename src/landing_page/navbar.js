import './navbar.css';

function NavItem ({name}) {
    return (
        <div className="nav_item">
            <h1 className="item_name"> {/*This allows the nav item's name to be centered vertically*/}
                {name}
            </h1>
        </div>
    );
}

function Navbar() {
    return (
        <div className="nav">
            <NavItem name={"Page 1"}/>
            <NavItem name={"Page 2"}/>
            <NavItem name={"Page 3"}/>
        </div>
    );
}

export default Navbar;