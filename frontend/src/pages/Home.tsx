import { Link } from 'react-router-dom';
import styles from '../App.module.css';
import Header from '../components/Header';
import { INSTITUTES } from '../institutes';

const Home = () => {
    return (
        <div className={styles.app}>
            <Header />
            <div className={styles.hero}>
                <div className={styles.ruleDevice}>
                    <div className={styles.rectangle} />
                    <div className={styles.rectangle2} />
                    <div className={styles.rectangle3} />
                </div>
                <div className={styles.allIitsPlacement}>Industry Conclave at 49th AIPC </div>
                <div className={styles.thAipcMeet}>49th AIPC Meet 2026</div>
                <div className={styles.registerToConfirm}>Register to confirm your place. We’ll arrange your room and your airport transfer — there’s nothing else to book.</div>
                <div className={styles.factRow}>
                    <div className={styles.fact}>
                        <div className={styles.allIitsPlacement}>DATES</div>
                        <div className={styles.iitGuwahati}>4th September 2026</div>
                    </div>
                    <div className={styles.fact}>
                        <div className={styles.allIitsPlacement}>VENUE</div>
                        <div className={styles.iitGuwahati}>IIT Guwahati</div>
                    </div>
                    <div className={styles.fact}>
                        <div className={styles.allIitsPlacement}>REGISTRATION</div>
                        <div className={styles.iitGuwahati}>Open now</div>
                    </div>
                </div>
            </div>
            <div className={styles.membershipBand}>
                <div className={styles.the23Member}>THE 23 MEMBER INSTITUTES</div>
                <div className={styles.emblemGrid}>
                    {INSTITUTES.map((institute) => (
                        <a
                            key={institute.code}
                            href={institute.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.iitBhilai}
                        >
                            <img src={institute.logo} alt={institute.name} title={institute.shortName} className={styles.emblemRingIcon} />
                        </a>
                    ))}
                </div>
            </div>
            <div className={styles.registration2}>
                <div className={styles.twoColumns}>
                    <div className={styles.colCommittee}>
                        <div className={styles.thisEdition}>REGISTRATION</div>
                        <div className={styles.confirmYourAttendance}>Confirm your attendance</div>
                        <div className={styles.eachInstituteSends}>Each institute sends one delegate, normally the professor-in-charge of placement.</div>
                        <div className={styles.onceYouRegister}>Once you register, we’ll email your confirmation and joining instructions.</div>
                    </div>
                    <div className={styles.colThisMeeting}>
                        <div className={styles.thisEdition}>THIS EDITION</div>
                        <div className={styles.the49thMeet}>The 49th meet</div>
                        <div className={styles.iitGuwahatiHosts}>IIT Guwahati hosts the committee for three days in September 2026.</div>
                        <div className={styles.figuresRule} />
                        <div className={styles.figures}>
                            <div className={styles.figure}>
                                <div className={styles.div}>23</div>
                                <div className={styles.participatingIits}>PARTICIPATING IITs</div>
                            </div>
                            <div className={styles.figure}>
                                <div className={styles.div}>50+</div>
                                <div className={styles.participatingIits}>POLICY SESSIONS</div>
                            </div>
                            <div className={styles.figure}>
                                <div className={styles.div}>500+</div>
                                <div className={styles.participatingIits}>CORPORATE DELEGATES</div>
                            </div>
                            <div className={styles.figure}>
                                <div className={styles.div}>25k+</div>
                                <div className={styles.participatingIits}>STUDENTS REPRESENTED</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.riverRule} id="register">
                <div className="w-full flex flex-col items-center text-center py-16 px-6 bg-[#f7f9fd] border border-[#c3c6d1] rounded-xl my-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#d5e3ff] rounded-2xl mb-6">
                        <span className="material-symbols-outlined text-[#001e40] text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_reg</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-[#001e40] mb-3">Register your institute's delegate</h2>
                    <p className="text-[#5c5f60] max-w-[520px] mb-8">Select your IIT, confirm your details, and you're done. Confirmation and joining instructions follow by email.</p>
                    <Link
                        to="/register"
                        className="h-12 px-8 flex items-center justify-center gap-2 bg-[#001e40] text-white text-sm font-medium rounded hover:bg-[#003366] transition-all"
                    >
                        <span>Register now</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                </div>
            </div>
            <div className={styles.programme2}>
                <div className={styles.allIitsPlacement}>PROGRAMME</div>
                <div className={styles.confirmYourAttendance}>Industry Conclave as 49th AIPC</div>
                <div className={styles.iitGuwahatiHosts}>Sessions run across all three days. We’ll email you the detailed programme once it’s confirmed, and publish it here.</div>
                <div className={styles.dayCards}>
                    <div className={styles.day01}>
                        <div className={styles.cardTopRule} />
                        <div className={styles.spacer} />
                        <div className={styles.sectionIndex}>
                            <div className={styles.register}>Industry Conclave</div>
                            <div className={styles.programme4}></div>
                            <div className={styles.rule} />
                        </div>
                        <div className={styles.spacer2} />
                        <div className={styles.september}>4th September</div>
                        <div className={styles.monday}>FRIDAY</div>
                        <div className={styles.spacer2} />
                    </div>
                </div>
            </div>
            <div className={styles.travelAndStay}>
                <div className={styles.twoColumns2}>
                    <div className={styles.colHostInstitution}>
                        <div className={styles.allIitsPlacement}>THE CAMPUS</div>
                        <div className={styles.confirmYourAttendance}>On the north bank of the Brahmaputra</div>
                        <div className={styles.bracketedStatement}>
                            <div className={styles.sevenHundredAcres}>Seven hundred acres on the north bank of the Brahmaputra, in North Guwahati.</div>
                            <div className={styles.bracketArm} />
                            <div className={styles.bracketArm2} />
                            <div className={styles.bracketArm3} />
                            <div className={styles.bracketArm4} />
                        </div>
                        <div className={styles.campusPhotograph}>
                            <div className={styles.campusPhotograph2}>CAMPUS PHOTOGRAPH</div>
                        </div>
                    </div>
                    <div className={styles.colArrivingAndStaying}>
                        <div className={styles.gettingThere}>GETTING THERE</div>
                        <div className={styles.item}>
                            <div className={styles.dash} />
                            <div className={styles.t}>
                                <div className={styles.everySessionTakes}>Every session takes place on campus.</div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.dash} />
                            <div className={styles.t}>
                                <div className={styles.everySessionTakes}>You’ll stay on campus. Nothing to book.</div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.dash} />
                            <div className={styles.t}>
                                <div className={styles.everySessionTakes}>Fly into Lokpriya Gopinath Bordoloi International Airport. We’ll collect you and bring you to campus.</div>
                            </div>
                        </div>
                        <div className={styles.wellSendYour}>We’ll send your room details, transfer time and a campus map before you travel.</div>
                    </div>
                </div>
            </div>
            <div className={styles.footer}>
                <div className={styles.ruleDevice2}>
                    <div className={styles.rectangle4} />
                    <div className={styles.rectangle5} />
                    <div className={styles.rectangle6} />
                </div>
                <div className={styles.footerColumns}>
                    <div className={styles.col}>
                        <div className={styles.thAipcMeet2}>49th AIPC Meet 2026</div>
                        <div className={styles.everySessionTakes}>4th September 2026</div>
                        <div className={styles.everySessionTakes}>Indian Institute of Technology Guwahati</div>
                    </div>
                    <div className={styles.col2}>
                        <div className={styles.registrationQueries}>Registration queries</div>
                        <div className={styles.writeToThe}>Write to the organising committee at IIT Guwahati. Address published shortly.</div>
                    </div>
                    <div className={styles.col2}>
                        <div className={styles.registrationQueries}>For recruiters</div>
                        <div className={styles.writeToThe}>AIPC guidelines and 2026–27 season dates, published closer to the meet.</div>
                    </div>
                </div>
                <div className={styles.legalRule} />
                <div className={styles.hostedByIit}>HOSTED BY IIT GUWAHATI ON BEHALF OF THE ALL IITs' PLACEMENT COMMITTEE</div>
            </div>
        </div>
    );
};

export default Home;
