import Navbar from "../navbar/navbar";
import styles from "../slide_puzzle/slide_puzzle.module.css"
import brick_back from '/home/nolester/Desktop/Nole_Website/nole_website/src/slide_puzzle/temp_textures/brick.png'


function importAll(r) {
    let textures = {};
    r.keys().map((item, index) => { textures[item.replace('./', '')] = r(item); return 0;});
    return textures;
}

function makeTable(size) {
    // Makes and returns a square table of {size} size
    let myTable = [];
    let textures = importAll(require.context('../slide_puzzle/temp_textures', false, /\.(png|jpe?g|svg|webp)$/));

    for (let i = 0; i < size; i++) {
        let myRow = [];
        for (let j = 0; j < size; j++) {
            let curr_texture = textures[`t${i}_${j}.webp`];
            myRow.push(<td id={`${i}_${j}`} key={`${i}_${j}`} style={{ backgroundImage: `url(${curr_texture}` }}></td>); // key= i_j
        }
        myTable.push(<tr key={i}>{myRow}</tr>);
    }
    myTable = <table><tbody>{myTable}</tbody></table>;
    return myTable;
}

function SlidePuzzle() {
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