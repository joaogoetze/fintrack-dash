import "./PrimaryButton.css";

type PrimaryButtonProps = {
    buttonText: string;
    onClick?: () => void;
}

function PrimaryButton({ buttonText, onClick }: PrimaryButtonProps) {
    return (
        <button className="primary-button" onClick={onClick}>
            {buttonText}
        </button>
    );
}

export default PrimaryButton;