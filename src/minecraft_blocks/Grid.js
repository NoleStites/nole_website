
function format_grid_html(columns, rows, window_width) {
    // let size = Math.floor(window_width / columns);
    let size = 200;
    let dimension_styles = {
        // height: 'calc('+window_width+'px/'+columns+')',
        height: 'calc('+100/columns+'vw)'
        // height: size+'px',
        // width: size+'px'
    };
    let grid = []
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            row.push(<td key={j} className='grid_spot' style={dimension_styles}></td>);
        }
        grid.push(<tr key={i}>{row}</tr>);
    }
    return grid;
}

function Grid(props) {
    let window_width = document.documentElement.clientWidth;
    let grid = format_grid_html(props.columns, props.rows, window_width);

    // let spots = document.getElementsByClassName("grid_spot");
    // console.log(spots);
    // let spot = spots[0];
    // console.log(spot);

    // let t = document.getElementById("my_table");
    // console.log(t.offsetWidth);

    return (
        <table id="my_table">
            <tbody>
                {grid}
            </tbody>
        </table>
    );
}

export default Grid;