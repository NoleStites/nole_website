import './Sidepanel.css';

function Sidepanel() {
    /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
    function openNav() {
        document.getElementById("mySidebar").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
    }
    
    /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
    function closeNav() {
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
    }

    return (
        <>
        <div id="mySidebar" className="sidebar">
            <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>&times;</a>
        </div>

        <div id="main">
            <button className="openbtn" onClick={openNav}>&#9776; Open Sidebar</button>
        </div>        
        </>
    );
}

export default Sidepanel;