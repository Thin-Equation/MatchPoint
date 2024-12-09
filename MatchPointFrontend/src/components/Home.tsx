import { useAuth0 } from "@auth0/auth0-react";

export default function Example() {
    return (
        <>
            <HeroSection />
            <FeatureSection />
            <CallToAction />
            <TrustSection />
        </>
    );
}

function HeroSection() {
    const { loginWithRedirect } = useAuth0();

    return (
        <main className="relative bg-white">
            <div className="relative mx-auto px-8 max-w-8xl">
                <div className="relative z-10 pt-14 lg:w-full lg:max-w-2xl">
                    <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:pr-0 animate-fade-in">
                        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
                            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                                MatchPoint
                            </h1>
                            <p className="mt-4 text-sm font-semibold text-indigo-500">
                                Trusted by over 10,000 professionals worldwide
                            </p>
                            <h3 className="mt-6 text-5xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                                Transform Your Resume, Transform Your Career
                            </h3>
                            <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl">
                                One platform to drive towards a perfect resume.
                            </p>
                            <div className="mt-10 flex items-center gap-x-6">
                                <button
                                    onClick={() => loginWithRedirect()}
                                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 hover:scale-105 transition-transform duration-200"
                                >
                                    Get started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative bg-gray-50 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 to-transparent"></div>
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1483389127117-b6a2102724ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80"
                        alt="Business"
                    />
                </div>
            </div>
        </main>
    );
}

function FeatureSection() {
    const features = [
        {
            title: "AI Powered Resume Analysis",
            description: "Our AI-driven technology analyzes your resume for industry-specific keywords, formatting, and structure to give you tailored suggestions that make you stand out to hiring managers. Get instant feedback and actionable improvements.",
            icon: (
                <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                </svg>
            ),
        },
        {
            title: "Custom Templates Tailored to Your Industry",
            description: "We offer a range of expertly designed templates that cater to your specific industry needs. Whether you are in tech, finance, healthcare, or another field, our templates help your resume shine, ensuring you make the best impression.",
            icon: (
                <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                </svg>
            ),
        },
    ];

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-5">
                    <h2 className="col-span-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                        Why choose our platform?
                    </h2>
                    <dl className="col-span-3 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2">
                        {features.map((feature, index) => (
                            <div key={index}>
                                <dt className="text-base/7 font-semibold text-gray-900">
                                    <div className="mb-6 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                                        {feature.icon}
                                    </div>
                                    {feature.title}
                                </dt>
                                <dd className="mt-1 text-base/7 text-gray-600">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}

function CallToAction() {
    return (
        <div className="bg-indigo-100">
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
                <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                    Ready to Transform Your Career?
                    <br />
                    Start your free trial today.
                </h2>
                <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:shrink-0">
                    <a
                        href="#"
                        className="rounded-md bg-indigo-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Get started
                    </a>
                </div>
            </div>
        </div>
    );
}

function TrustSection() {
    const stats = [
        { label: "Resumes Scored", value: "3,000+" },
        { label: "User Satisfaction", value: "95%" },
        { label: "Increased Call backs for interviews", value: "60%" },
        { label: "Accuracy", value: "90%" },
    ];

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:max-w-none">
                    <div className="text-center">
                        <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                            Trusted by over 10,000 professionals worldwide
                        </h2>
                        <p className="mt-4 text-lg/8 text-gray-600">
                            Transforming Careers one Resume at a Time
                        </p>
                    </div>
                    <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex flex-col bg-gray-400/5 p-8">
                                <dt className="text-sm/6 font-semibold text-gray-600">{stat.label}</dt>
                                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}