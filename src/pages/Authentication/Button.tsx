export default function Button(props){
    return(
        <div className="button-box">
            <button className="button" name={props.name} id={props.id} type={props.type}>{props.content}</button>
            <a href={props.link} target={props.target}><p>{props.p}<span> {props.span}</span></p></a>
        </div>
    )
}