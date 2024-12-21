// import './navbar.css';
import styles from './navbar.module.css'
import { Link } from "react-router-dom";

function NavItem({ name, route }) {
    return (
        <div className={styles.dropdown}>
            <div className={styles.nav_item}>
                <Link to={route}>
                    <h1 className={styles.item_name}> {/*This allows the nav item's name to be centered vertically*/}
                        {name}
                    </h1>
                </Link>
            </div>
        </div>
    );
}

function NavList ({ name, dropdown }) {
    return (
        <div className={styles.dropdown}>
            <div className={styles.nav_item}>
                    <h1 className={styles.item_name}> {/*This allows the nav item's name to be centered vertically*/}
                        {name}
                    </h1>
            </div>
            <div className={styles.dropdown_content}>
                {
                    Object.entries(dropdown)
                    .map( ([item_name, url]) => <Link to={url} key={url}><p className={styles.dropdown_item}>{item_name}</p></Link> )
                }
            </div>
        </div>
    );
}

function Navbar() {
    return (
        <div className={styles.nav}>
            <NavItem name={"Home"} route={"/"}/>
            <NavList name={"Projects"} dropdown={{
                "Minecraft Block Textures": "/minecraft", 
                "Slide Puzzle": "/slide_puzzle"
                }}/>
        </div>
    );
}

export default Navbar;