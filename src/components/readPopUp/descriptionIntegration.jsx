import './readPopUp.css';

function DescriptionIntegration({ description }) {
    return (
        <div className="descriptionContainer">
            <label className="descriptionLabel">Description :</label>
            <div className="descriptionBox">
                {description ? description : "Aucune description disponible."}
            </div>
        </div>
    );
}

export default DescriptionIntegration;