export default function Eye(props) {
    const { isPasswordVisible, togglePasswordVisibility } = props;

    return (
        <span
            style={props.css}
            onClick={togglePasswordVisibility}
            className="MdOutlineVisibility "
        >
            {isPasswordVisible ? 'Eye' : 'Eye'}
        </span>
    );
}
