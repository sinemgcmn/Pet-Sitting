export default function Presentational({
    first,
    last,
    imageUrl,
    toggleUploader,
    classForImgSmall,
}) {
    // console.log("props in Presentational: ", props);

    imageUrl = imageUrl || "default.jpeg";
    return (
        <div className="profile-picture-container">
            <img
                onClick={toggleUploader}
                className={classForImgSmall}
                src={imageUrl}
            />
        </div>
    );
}
