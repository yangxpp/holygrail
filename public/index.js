function PlusMinus(props) {
    function handle(e) {
        if (e.target.id.includes('minus')) {
            props.handle({name:props.section, value:-1});
            return;
        }
        props.handle({name:props.section, value:1});
    }
    return (<>
        <img src={`icons/${props.section}_plus.png`} id="plus" onClick={e => handle(e)} />
        <img src={`icons/${props.section}_minus.png`} id="minus" onClick={e => handle(e)} />
    </>)
}

function Data(props) {
    return (<div>
        Header: {props.data.header},
        Nav: {props.data.nav},
        Left: {props.data.left},
        Article: {props.data.article},
        Right: {props.data.right},
        Footer: {props.data.footer}
    </div>);
}

function update(section, value) {
    return new Promise((resolve, reject) => {
        var url = `/update/${section}/${value}`;
        superagent
            .get(url)
            .end(function(err, res) {
                err ? reject(null) : resolve(res.text);
            });
    });
}

function read() {
    return new Promise((resolve, reject) => {
        var url = '/data';
        superagent
            .get(url)
            .end(function(err, res) {
                err ? reject(null) : resolve(res.text);
            });
    });
}

function App() {
    const [data, setData] = React.useState({"header":0,"nav":0,"left":0,"article":0,"right":0,"footer":0});

    React.useEffect(() => {
        // read db data & update UI
        const response = read()
            .then(res => {
                console.log('useEffect res', res);
                setData(JSON.parse(res));
            });
    }, []);

    function handle(section) {
        // update db & local state
        const response = update(section.name, section.value)
            .then(res => {
                console.log('handle ', res);
                setData(JSON.parse(res));
            });
    }

    return (<>
        <div className="grid">
            <Header handle={handle} data={data} />
            <Nav handle={handle} data={data} />
            <Left handle={handle} data={data} />
            <Article handle={handle} data={data} />
            <Right handle={handle} data={data} />
            <Footer handle={handle} data={data} />
        </div>
    </>);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);