function Nav(props) {
    return (<>
        <nav>
            <PlusMinus section="nav" handle={props.handle} />
            <div className="section">Nav:{props.data.nav}</div>
            <Data data={props.data} />
        </nav>
    </>);
}