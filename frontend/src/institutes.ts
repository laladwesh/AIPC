export interface Institute {
    code: string;
    name: string;
    shortName: string;
    logo: string;
    website: string;
}

// Keep codes in sync with models/EventCompany.js
export const INSTITUTES: Institute[] = [
    { code: 'kharagpur', name: 'IIT Kharagpur', shortName: 'Kharagpur', logo: 'logos/kharagpur.svg', website: 'https://www.iitkgp.ac.in/' },
    { code: 'bombay', name: 'IIT Bombay', shortName: 'Bombay', logo: 'logos/bombay.svg', website: 'https://www.iitb.ac.in/' },
    { code: 'madras', name: 'IIT Madras', shortName: 'Madras', logo: 'logos/madras.svg', website: 'https://www.iitm.ac.in/' },
    { code: 'kanpur', name: 'IIT Kanpur', shortName: 'Kanpur', logo: 'logos/kanpur.png', website: 'https://www.iitk.ac.in/' },
    { code: 'delhi', name: 'IIT Delhi', shortName: 'Delhi', logo: 'logos/delhi.svg', website: 'https://home.iitd.ac.in/' },
    { code: 'guwahati', name: 'IIT Guwahati', shortName: 'Guwahati', logo: 'logos/guwahati.webp', website: 'https://www.iitg.ac.in/' },
    { code: 'roorkee', name: 'IIT Roorkee', shortName: 'Roorkee', logo: 'logos/roorkee.svg', website: 'https://www.iitr.ac.in/' },
    { code: 'ropar', name: 'IIT Ropar', shortName: 'Ropar', logo: 'logos/ropar.svg', website: 'https://www.iitrpr.ac.in/' },
    { code: 'bhubaneswar', name: 'IIT Bhubaneswar', shortName: 'Bhubaneswar', logo: 'logos/bhubaneswar.svg', website: 'https://www.iitbbs.ac.in/' },
    { code: 'gandhinagar', name: 'IIT Gandhinagar', shortName: 'Gandhinagar', logo: 'logos/gandhinagar.svg', website: 'https://www.iitgn.ac.in/' },
    { code: 'hyderabad', name: 'IIT Hyderabad', shortName: 'Hyderabad', logo: 'logos/hyderabad.svg', website: 'https://www.iith.ac.in/' },
    { code: 'jodhpur', name: 'IIT Jodhpur', shortName: 'Jodhpur', logo: 'logos/jodhpur.svg', website: 'https://iitj.ac.in/' },
    { code: 'patna', name: 'IIT Patna', shortName: 'Patna', logo: 'logos/patna.jpg', website: 'https://www.iitp.ac.in/' },
    { code: 'indore', name: 'IIT Indore', shortName: 'Indore', logo: 'logos/indore.webp', website: 'https://www.iiti.ac.in/' },
    { code: 'mandi', name: 'IIT Mandi', shortName: 'Mandi', logo: 'logos/mandi.svg', website: 'https://www.iitmandi.ac.in/' },
    { code: 'varanasi', name: 'IIT (BHU) Varanasi', shortName: 'Varanasi', logo: 'logos/varanasi.webp', website: 'https://iitbhu.ac.in/' },
    { code: 'palakkad', name: 'IIT Palakkad', shortName: 'Palakkad', logo: 'logos/palakkad.jpg', website: 'https://iitpkd.ac.in/' },
    { code: 'tirupati', name: 'IIT Tirupati', shortName: 'Tirupati', logo: 'logos/tirupati.svg', website: 'https://iittp.ac.in/' },
    { code: 'dhanbad', name: 'IIT (ISM) Dhanbad', shortName: 'Dhanbad', logo: 'logos/dhanbad.svg', website: 'https://www.iitism.ac.in/' },
    { code: 'bhilai', name: 'IIT Bhilai', shortName: 'Bhilai', logo: 'logos/bhilai.svg', website: 'https://www.iitbhilai.ac.in/' },
    { code: 'dharwad', name: 'IIT Dharwad', shortName: 'Dharwad', logo: 'logos/dharwad.svg', website: 'https://www.iitdh.ac.in/' },
    { code: 'jammu', name: 'IIT Jammu', shortName: 'Jammu', logo: 'logos/jammu.svg', website: 'https://www.iitjammu.ac.in/' },
    { code: 'goa', name: 'IIT Goa', shortName: 'Goa', logo: 'logos/goa.svg', website: 'https://iitgoa.ac.in/' }
];
