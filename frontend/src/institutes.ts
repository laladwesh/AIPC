export interface Institute {
    code: string;
    name: string;
    shortName: string;
    logo: string;
    website: string;
}

// Vite gotcha: public/ assets referenced with a leading "/" resolve against
// the domain root, not the configured base path, so they 404 once deployed
// under a sub-path like /aipc. import.meta.env.BASE_URL is the fix.
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

// Keep codes in sync with models/EventCompany.js
export const INSTITUTES: Institute[] = [
    { code: 'kharagpur', name: 'IIT Kharagpur', shortName: 'Kharagpur', logo: asset('logos/kharagpur.svg'), website: 'https://www.iitkgp.ac.in/' },
    { code: 'bombay', name: 'IIT Bombay', shortName: 'Bombay', logo: asset('logos/bombay.svg'), website: 'https://www.iitb.ac.in/' },
    { code: 'madras', name: 'IIT Madras', shortName: 'Madras', logo: asset('logos/madras.svg'), website: 'https://www.iitm.ac.in/' },
    { code: 'kanpur', name: 'IIT Kanpur', shortName: 'Kanpur', logo: asset('logos/kanpur.png'), website: 'https://www.iitk.ac.in/' },
    { code: 'delhi', name: 'IIT Delhi', shortName: 'Delhi', logo: asset('logos/delhi.svg'), website: 'https://home.iitd.ac.in/' },
    { code: 'guwahati', name: 'IIT Guwahati', shortName: 'Guwahati', logo: asset('logos/guwahati.webp'), website: 'https://www.iitg.ac.in/' },
    { code: 'roorkee', name: 'IIT Roorkee', shortName: 'Roorkee', logo: asset('logos/roorkee.svg'), website: 'https://www.iitr.ac.in/' },
    { code: 'ropar', name: 'IIT Ropar', shortName: 'Ropar', logo: asset('logos/ropar.svg'), website: 'https://www.iitrpr.ac.in/' },
    { code: 'bhubaneswar', name: 'IIT Bhubaneswar', shortName: 'Bhubaneswar', logo: asset('logos/bhubaneswar.svg'), website: 'https://www.iitbbs.ac.in/' },
    { code: 'gandhinagar', name: 'IIT Gandhinagar', shortName: 'Gandhinagar', logo: asset('logos/gandhinagar.svg'), website: 'https://www.iitgn.ac.in/' },
    { code: 'hyderabad', name: 'IIT Hyderabad', shortName: 'Hyderabad', logo: asset('logos/hyderabad.svg'), website: 'https://www.iith.ac.in/' },
    { code: 'jodhpur', name: 'IIT Jodhpur', shortName: 'Jodhpur', logo: asset('logos/jodhpur.svg'), website: 'https://iitj.ac.in/' },
    { code: 'patna', name: 'IIT Patna', shortName: 'Patna', logo: asset('logos/patna.jpg'), website: 'https://www.iitp.ac.in/' },
    { code: 'indore', name: 'IIT Indore', shortName: 'Indore', logo: asset('logos/indore.webp'), website: 'https://www.iiti.ac.in/' },
    { code: 'mandi', name: 'IIT Mandi', shortName: 'Mandi', logo: asset('logos/mandi.svg'), website: 'https://www.iitmandi.ac.in/' },
    { code: 'varanasi', name: 'IIT (BHU) Varanasi', shortName: 'Varanasi', logo: asset('logos/varanasi.webp'), website: 'https://iitbhu.ac.in/' },
    { code: 'palakkad', name: 'IIT Palakkad', shortName: 'Palakkad', logo: asset('logos/palakkad.jpg'), website: 'https://iitpkd.ac.in/' },
    { code: 'tirupati', name: 'IIT Tirupati', shortName: 'Tirupati', logo: asset('logos/tirupati.svg'), website: 'https://iittp.ac.in/' },
    { code: 'dhanbad', name: 'IIT (ISM) Dhanbad', shortName: 'Dhanbad', logo: asset('logos/dhanbad.svg'), website: 'https://www.iitism.ac.in/' },
    { code: 'bhilai', name: 'IIT Bhilai', shortName: 'Bhilai', logo: asset('logos/bhilai.svg'), website: 'https://www.iitbhilai.ac.in/' },
    { code: 'dharwad', name: 'IIT Dharwad', shortName: 'Dharwad', logo: asset('logos/dharwad.svg'), website: 'https://www.iitdh.ac.in/' },
    { code: 'jammu', name: 'IIT Jammu', shortName: 'Jammu', logo: asset('logos/jammu.svg'), website: 'https://www.iitjammu.ac.in/' },
    { code: 'goa', name: 'IIT Goa', shortName: 'Goa', logo: asset('logos/goa.svg'), website: 'https://iitgoa.ac.in/' }
];
