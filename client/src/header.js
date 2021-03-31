export default function Header() {
    return (
        <div className="header">
            <img className="logo" src="/logo.png" alt="logo" />
            <div className="header-part">
                <a href="/logout">Log out</a>
                <a href="/login">Log in</a>
                <a href="/register">Register</a>
            </div>
        </div>
    );
}
