
function format_grid_html(columns, rows) {
    let grid = []
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            row.push(<td key={j} className='grid_spot'></td>);
        }
        grid.push(<tr key={i}>{row}</tr>);
    }
    return grid;
}

function Grid(props) {
    let grid = format_grid_html(props.columns, props.rows);

    return (
        <table>
            <tbody>
                {grid}
            </tbody>
        </table>
    );
}

export default Grid;