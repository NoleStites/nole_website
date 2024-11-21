import './navbar.css';

function NavItem ({ name, dropdown }) {
    if (dropdown) {
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
                        .map( ([item_name, url]) => <a href={url}><p className='dropdown_item'>{item_name}</p></a> )
                    }
                </div>
            </div>
        );
    } else {
        return (
            <div className='dropdown'>
                <div className="nav_item">
                        <h1 className="item_name"> {/*This allows the nav item's name to be centered vertically*/}
                            {name}
                        </h1>
                </div>
            </div>
        );
    }
}

function Navbar() {
    return (
        <div className="nav">
            <NavItem name={"Page 1"}/>
            <NavItem name={"Page 2"}/>
            <NavItem name={"Page 3"} dropdown={{"Test 1": "URL1", "Test 2": "URL2"}}/>
        </div>
    );
}

export default Navbar;