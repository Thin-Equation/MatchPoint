import ContactComponent from "../components/Contact"; // Use a different name for the imported component

const Contact = () => {
    return (
        <div>
            <ContactComponent /> {/* Use the renamed component here */}
        </div>
    );
};

export default Contact;
