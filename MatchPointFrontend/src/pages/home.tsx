import HomeComponent from "../components/Home"; // Use a different name for the imported component

const Home = () => {
    return (
        <div>
            <HomeComponent /> {/* Use the renamed component here */}
        </div>
    );
};

export default Home;
