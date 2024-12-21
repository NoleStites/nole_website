import Navbar from "../navbar/navbar";
import styles from "../slide_puzzle/slide_puzzle.module.css"


function importAll(r) {
    let textures = {};
    r.keys().map((item, index) => { textures[item.replace('./', '')] = r(item); return 0;});
    return textures;
}

function makeTable(size) {
    // Makes and returns a square table of {size} size
    let myTable = [];
    let textures = importAll(require.context('../slide_puzzle/temp_textures', false, /\.(png|jpe?g|svg|webp)$/));

    let counter = 0;
    for (let i = 0; i < size; i++) {
        let myRow = [];
        for (let j = 0; j < size; j++) {
            let curr_texture = textures[`t${i}_${j}.webp`];
            counter += 1;
            if (counter != size*size) {
                myRow.push(<td id={`${i}_${j}`} key={`${i}_${j}`} style={{ backgroundImage: `url(${curr_texture}` }}></td>); // key= i_j
            } else {
                myRow.push(<td id={`${i}_${j}`} key={`${i}_${j}`} className={styles.empty_spot}></td>);
            }
        }
        myTable.push(<tr key={i}>{myRow}</tr>);
    }
    myTable = <table><tbody>{myTable}</tbody></table>;
    return myTable;
}

let already_pressed = false;
function handleKeyPress(key) {
    if (already_pressed) {
        already_pressed = false;
        return;
    } else {
        already_pressed = true;
    }

    let empty_spots = document.getElementsByClassName[styles['empty_spot']];
    // let empty_spot = document.getElementsByTagName('td');
    console.log(empty_spots);
    // console.log(styles['empty_spot']);

    if (key == 'w') {

    } else if (key == 'a') {

    } else if (key == 's') {
        
    } else if (key == 'd') {
        
    }
}

function SlidePuzzle() {
    document.addEventListener('keydown', function(event){
        handleKeyPress(event.key);
    })

    let table_size = 3
    return (
        <div className={styles.page}>
            <Navbar />
            <div className={styles.flex_body}>
                {makeTable(table_size)}
            </div>
        </div>
    )
}

export default SlidePuzzle;