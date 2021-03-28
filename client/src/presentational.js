export default function Presentational({
    first,
    last,
    imageUrl,
    toggleUploader,
}) {
    // console.log("props in Presentational: ", props);

    imageUrl = imageUrl || "default.jpeg";
    return (
        <div>
            <img
                onClick={toggleUploader}
                // className={classForImgSmall}
                src={imageUrl}
                alt={`${first + last}`}
            />
        </div>
    );
}
