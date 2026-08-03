import { Link } from 'react-router-dom';
import styles from '../App.module.css';
import Header from '../components/Header';
import { INSTITUTES } from '../institutes';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const Home = () => {
    useDocumentMeta({
        path: '/',
        title: '49th AIPC Meet 2026 | All IITs Placement Committee, IIT Guwahati',
        description: 'The 49th All IITs Placement Committee (AIPC) meet — 4th September 2026 at IIT Guwahati. Register your company for the industry conclave, policy sessions, and placement season coordination across all 23 IITs.'
    });

    return (
        <div className={styles.app}>
            <Header />
            <main>
                <section className={styles.hero} aria-labelledby="hero-title">
                    <div className={styles.ruleDevice}>
                        <div className={styles.rectangle} />
                        <div className={styles.rectangle2} />
                        <div className={styles.rectangle3} />
                    </div>
                    <p className={styles.allIitsPlacement}>Industry Conclave at 49th AIPC</p>
                    <h1 id="hero-title" className={styles.thAipcMeet}>49th AIPC Meet 2026</h1>
                    <p className={styles.registerToConfirm}>Register to confirm your place. We’ll arrange your room and your airport transfer — there’s nothing else to book.</p>
                    <div className={styles.factRow}>
                        <div className={styles.fact}>
                            <span className={styles.allIitsPlacement}>DATES</span>
                            <span className={styles.iitGuwahati}>4th September 2026</span>
                        </div>
                        <div className={styles.fact}>
                            <span className={styles.allIitsPlacement}>VENUE</span>
                            <span className={styles.iitGuwahati}>IIT Guwahati</span>
                        </div>
                        <div className={styles.fact}>
                            <span className={styles.allIitsPlacement}>REGISTRATION</span>
                            <span className={styles.iitGuwahati}>Open now</span>
                        </div>
                    </div>
                </section>

                <section className={styles.membershipBand} aria-labelledby="members-title">
                    <h2 id="members-title" className={styles.the23Member}>THE 23 MEMBER INSTITUTES</h2>
                    <div className={styles.emblemGrid}>
                        {INSTITUTES.map((institute, index) => (
                            <a
                                key={institute.code}
                                href={institute.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.iitBhilai}
                            >
                                <img
                                    src={institute.logo}
                                    alt={institute.name}
                                    title={institute.shortName}
                                    className={styles.emblemRingIcon}
                                    width={84}
                                    height={84}
                                    loading={index < 8 ? 'eager' : 'lazy'}
                                />
                            </a>
                        ))}
                    </div>
                </section>

                <section className={styles.registration2} aria-labelledby="registration-title">
                    <h2 id="registration-title" className="sr-only">Registration</h2>
                    <div className={styles.twoColumns}>
                        <div className={styles.colCommittee}>
                            <p className={styles.thisEdition}>REGISTRATION</p>
                            <h3 className={styles.confirmYourAttendance}>Confirm your attendance</h3>
                            <p className={styles.eachInstituteSends}>Each institute sends one delegate, normally the professor-in-charge of placement.</p>
                            <p className={styles.onceYouRegister}>Once you register, we’ll email your confirmation and joining instructions.</p>
                        </div>
                        <div className={styles.colThisMeeting}>
                            <p className={styles.thisEdition}>THIS EDITION</p>
                            <h3 className={styles.the49thMeet}>The 49th meet</h3>
                            <p className={styles.iitGuwahatiHosts}>IIT Guwahati hosts the committee for three days in September 2026.</p>
                            <div className={styles.figuresRule} />
                            <div className={styles.figures}>
                                <div className={styles.figure}>
                                    <span className={styles.div}>23</span>
                                    <span className={styles.participatingIits}>PARTICIPATING IITs</span>
                                </div>
                                <div className={styles.figure}>
                                    <span className={styles.div}>50+</span>
                                    <span className={styles.participatingIits}>POLICY SESSIONS</span>
                                </div>
                                <div className={styles.figure}>
                                    <span className={styles.div}>500+</span>
                                    <span className={styles.participatingIits}>CORPORATE DELEGATES</span>
                                </div>
                                <div className={styles.figure}>
                                    <span className={styles.div}>25k+</span>
                                    <span className={styles.participatingIits}>STUDENTS REPRESENTED</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.riverRule} id="register" aria-labelledby="register-cta-title">
                    <div className="w-full flex flex-col items-center text-center py-16 px-6 bg-[#f7f9fd] border border-[#c3c6d1] rounded-xl my-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#d5e3ff] rounded-2xl mb-6">
                            <span className="material-symbols-outlined text-[#001e40] text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_reg</span>
                        </div>
                        <h2 id="register-cta-title" className="text-2xl sm:text-3xl font-semibold text-[#001e40] mb-3">Register your company</h2>
                        <p className="text-[#5c5f60] max-w-[520px] mb-8">Enter your company details and the IIT bringing you, and you're done. Confirmation follows by email.</p>
                        <Link
                            to="/register"
                            className="h-12 px-8 flex items-center justify-center gap-2 bg-[#001e40] text-white text-sm font-medium rounded hover:bg-[#003366] transition-all"
                        >
                            <span>Register now</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </Link>
                    </div>
                </section>

                <section className={styles.programme2} aria-labelledby="programme-title">
                    <p className={styles.allIitsPlacement}>PROGRAMME</p>
                    <h2 id="programme-title" className={styles.confirmYourAttendance}>Industry Conclave as 49th AIPC</h2>
                    <p className={styles.iitGuwahatiHosts}>Sessions run across all three days. We’ll email you the detailed programme once it’s confirmed, and publish it here.</p>
                    <div className={styles.dayCards}>
                        <article className={styles.day01}>
                            <div className={styles.cardTopRule} />
                            <div className={styles.spacer} />
                            <div className={styles.sectionIndex}>
                                <h3 className={styles.register}>Industry Conclave</h3>
                                <div className={styles.programme4}></div>
                                <div className={styles.rule} />
                            </div>
                            <div className={styles.spacer2} />
                            <p className={styles.september}>4th September</p>
                            <p className={styles.monday}>FRIDAY</p>
                            <div className={styles.spacer2} />
                        </article>
                    </div>
                </section>

                <section className={styles.travelAndStay} aria-labelledby="campus-title">
                    <div className={styles.twoColumns2}>
                        <div className={styles.colHostInstitution}>
                            <p className={styles.allIitsPlacement}>THE CAMPUS</p>
                            <h2 id="campus-title" className={styles.confirmYourAttendance}>On the north bank of the Brahmaputra</h2>
                            <div className={styles.bracketedStatement}>
                                <p className={styles.sevenHundredAcres}>Seven hundred acres on the north bank of the Brahmaputra, in North Guwahati.</p>
                                <div className={styles.bracketArm} />
                                <div className={styles.bracketArm2} />
                                <div className={styles.bracketArm3} />
                                <div className={styles.bracketArm4} />
                            </div>
                            <div className={styles.campusPhotograph}>
                                <span className={styles.campusPhotograph2}>CAMPUS PHOTOGRAPH</span>
                            </div>
                        </div>
                        <div className={styles.colArrivingAndStaying}>
                            <h3 className={styles.gettingThere}>GETTING THERE</h3>
                            <div className={styles.item}>
                                <div className={styles.dash} />
                                <div className={styles.t}>
                                    <p className={styles.everySessionTakes}>Every session takes place on campus.</p>
                                </div>
                            </div>
                            <div className={styles.item}>
                                <div className={styles.dash} />
                                <div className={styles.t}>
                                    <p className={styles.everySessionTakes}>You’ll stay on campus. Nothing to book.</p>
                                </div>
                            </div>
                            <div className={styles.item}>
                                <div className={styles.dash} />
                                <div className={styles.t}>
                                    <p className={styles.everySessionTakes}>Fly into Lokpriya Gopinath Bordoloi International Airport. We’ll collect you and bring you to campus.</p>
                                </div>
                            </div>
                            <p className={styles.wellSendYour}>We’ll send your room details, transfer time and a campus map before you travel.</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <div className={styles.ruleDevice2}>
                    <div className={styles.rectangle4} />
                    <div className={styles.rectangle5} />
                    <div className={styles.rectangle6} />
                </div>
                <div className={styles.footerColumns}>
                    <div className={styles.col}>
                        <p className={styles.thAipcMeet2}>49th AIPC Meet 2026</p>
                        <p className={styles.everySessionTakes}>4th September 2026</p>
                        <p className={styles.everySessionTakes}>Indian Institute of Technology Guwahati</p>
                    </div>
                    <div className={styles.col2}>
                        <p className={styles.registrationQueries}>Registration queries</p>
                        <p className={styles.writeToThe}>Write to the organising committee at IIT Guwahati. Address published shortly.</p>
                    </div>
                    <div className={styles.col2}>
                        <p className={styles.registrationQueries}>For recruiters</p>
                        <p className={styles.writeToThe}>AIPC guidelines and 2026–27 season dates, published closer to the meet.</p>
                    </div>
                </div>
                <div className={styles.legalRule} />
                <p className={styles.hostedByIit}>HOSTED BY IIT GUWAHATI ON BEHALF OF THE ALL IITs' PLACEMENT COMMITTEE</p>
            </footer>
        </div>
    );
};

export default Home;
