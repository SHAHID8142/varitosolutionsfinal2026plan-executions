/**
 * @file districts.ts
 * @description All 64 Bangladesh districts and their major upazilas/thanas.
 *              Used for address form dropdowns in checkout and admin.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-22
 */

export interface District {
  name: string
  thanas: string[]
}

export const BANGLADESH_DISTRICTS: District[] = [
  { name: "Bagerhat", thanas: ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"] },
  { name: "Bandarban", thanas: ["Alikadam", "Bandarban Sadar", "Lama", "Naikhongchhari", "Rowangchhari", "Ruma", "Thanchi"] },
  { name: "Barguna", thanas: ["Amtali", "Bamna", "Barguna Sadar", "Betagi", "Patharghata", "Taltali"] },
  { name: "Barisal", thanas: ["Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Barisal Sadar", "Gaurnadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur"] },
  { name: "Bhola", thanas: ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"] },
  { name: "Bogra", thanas: ["Adamdighi", "Bogra Sadar", "Dhunat", "Dhupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi", "Shajahanpur", "Sherpur", "Shibganj", "Sonatala"] },
  { name: "Brahmanbaria", thanas: ["Akhaura", "Ashuganj", "Bancharampur", "Brahmanbaria Sadar", "Kasba", "Nabinagar", "Nasirnagar", "Sarail"] },
  { name: "Chandpur", thanas: ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab Dakshin", "Matlab Uttar", "Shahrasti"] },
  { name: "Chapainawabganj", thanas: ["Bholahat", "Chapainawabganj Sadar", "Gomastapur", "Nachole", "Shibganj"] },
  { name: "Chattogram", thanas: ["Anwara", "Banshkhali", "Boalkhali", "Chandanaish", "Chattogram Sadar", "Fatikchhari", "Hathazari", "Karnaphuli", "Lohagara", "Mirsharai", "Patiya", "Rangunia", "Raozan", "Sandwip", "Satkania", "Sitakunda"] },
  { name: "Chuadanga", thanas: ["Alamdanga", "Chuadanga Sadar", "Damurhuda", "Jibannagar"] },
  { name: "Cox's Bazar", thanas: ["Chakaria", "Cox's Bazar Sadar", "Kutubdia", "Maheshkhali", "Pekua", "Ramu", "Teknaf", "Ukhia"] },
  { name: "Cumilla", thanas: ["Barura", "Brahmanpara", "Burichang", "Chandina", "Chauddagram", "Cumilla Adarsha Sadar", "Cumilla Sadar Dakshin", "Daudkandi", "Debidwar", "Homna", "Laksam", "Lalmai", "Meghna", "Monohargonj", "Muradnagar", "Nangalkot", "Titas"] },
  { name: "Dhaka", thanas: ["Adabor", "Badda", "Bangshal", "Cantonment", "Chawkbazar", "Dakshinkhan", "Dhanmondi", "Demra", "Dohar", "Gendaria", "Gulshan", "Hazaribagh", "Kafrul", "Kalabagan", "Kamrangirchar", "Keraniganj", "Khilgaon", "Khilkhet", "Kotwali", "Lalbagh", "Mirpur", "Mohammadpur", "Motijheel", "Nawabganj", "Pallabi", "Paltan", "Ramna", "Rayer Bazar", "Sabujbagh", "Shah Ali", "Shahjahanpur", "Sher-e-Bangla Nagar", "Shyampur", "Sutrapur", "Tejgaon", "Turag", "Uttara", "Uttarkhan"] },
  { name: "Dinajpur", thanas: ["Biral", "Birampur", "Birganj", "Bochaganj", "Chirirbandar", "Dinajpur Sadar", "Fulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"] },
  { name: "Faridpur", thanas: ["Alfadanga", "Bhanga", "Boalmari", "Charbhadrasan", "Faridpur Sadar", "Madhukhali", "Nagarkanda", "Sadarpur", "Saltha"] },
  { name: "Feni", thanas: ["Chhagalnaiya", "Daganbhuiyan", "Feni Sadar", "Parshuram", "Sonagazi"] },
  { name: "Gaibandha", thanas: ["Fulchhari", "Gaibandha Sadar", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj"] },
  { name: "Gazipur", thanas: ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur", "Tongi"] },
  { name: "Gopalganj", thanas: ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"] },
  { name: "Habiganj", thanas: ["Ajmiriganj", "Bahubal", "Baniachong", "Chunarughat", "Habiganj Sadar", "Lakhai", "Madhabpur", "Nabiganj", "Shaistaganj"] },
  { name: "Jamalpur", thanas: ["Bakshiganj", "Dewanganj", "Islampur", "Jamalpur Sadar", "Madarganj", "Melandaha", "Sarishabari"] },
  { name: "Jessore", thanas: ["Abhaynagar", "Bagherpara", "Chaugacha", "Jhikargacha", "Jessore Sadar", "Keshabpur", "Manirampur", "Sharsha"] },
  { name: "Jhalokati", thanas: ["Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur"] },
  { name: "Jhenaidah", thanas: ["Harinakunda", "Jhenaidah Sadar", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"] },
  { name: "Joypurhat", thanas: ["Akkelpur", "Joypurhat Sadar", "Kalai", "Khetlal", "Panchbibi"] },
  { name: "Khagrachhari", thanas: ["Dighinala", "Guimara", "Khagrachhari Sadar", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh"] },
  { name: "Khulna", thanas: ["Batiaghata", "Dacope", "Dighalia", "Dumuria", "Khalishpur", "Khan Jahan Ali", "Khulna Sadar", "Koyra", "Paikgachha", "Phultala", "Rupsa", "Sonadanga", "Terokhada"] },
  { name: "Kishoreganj", thanas: ["Austagram", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimganj", "Katiadi", "Kishoreganj Sadar", "Kuliarchar", "Mithamain", "Nikli", "Pakundia", "Tarail"] },
  { name: "Kurigram", thanas: ["Bhurungamari", "Char Rajibpur", "Chilmari", "Fulbari", "Kurigram Sadar", "Nageshwari", "Rajarhat", "Rajibpur", "Rowmari", "Ulipur"] },
  { name: "Kushtia", thanas: ["Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Kushtia Sadar", "Mirpur"] },
  { name: "Lakshmipur", thanas: ["Kamalnagar", "Lakshmipur Sadar", "Ramganj", "Ramgati", "Roypur"] },
  { name: "Lalmonirhat", thanas: ["Aditmari", "Hatibandha", "Kaliganj", "Lalmonirhat Sadar", "Patgram"] },
  { name: "Madaripur", thanas: ["Kalkini", "Madaripur Sadar", "Rajoir", "Shibchar"] },
  { name: "Magura", thanas: ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"] },
  { name: "Manikganj", thanas: ["Daulatpur", "Ghior", "Harirampur", "Manikganj Sadar", "Saturia", "Shibalaya", "Singair"] },
  { name: "Meherpur", thanas: ["Gangni", "Meherpur Sadar", "Mujibnagar"] },
  { name: "Moulvibazar", thanas: ["Barlekha", "Juri", "Kamalganj", "Kulaura", "Moulvibazar Sadar", "Rajnagar", "Sreemangal"] },
  { name: "Munshiganj", thanas: ["Gazaria", "Lohajang", "Munshiganj Sadar", "Sirajdikhan", "Sreenagar", "Tongibari"] },
  { name: "Mymensingh", thanas: ["Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Mymensingh Sadar", "Muktagachha", "Nandail", "Phulpur", "Trishal"] },
  { name: "Naogaon", thanas: ["Atrai", "Badalgachhi", "Dhamoirhat", "Mahadebpur", "Manda", "Mohanpur", "Naogaon Sadar", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"] },
  { name: "Narail", thanas: ["Kalia", "Lohagara", "Narail Sadar"] },
  { name: "Narayanganj", thanas: ["Araihazar", "Bandar", "Narayanganj Sadar", "Rupganj", "Sonargaon"] },
  { name: "Narsingdi", thanas: ["Belabo", "Monohardi", "Narsingdi Sadar", "Palash", "Raipura", "Shibpur"] },
  { name: "Natore", thanas: ["Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Natore Sadar", "Singra"] },
  { name: "Netrokona", thanas: ["Atpara", "Barhatta", "Durgapur", "Kalmakanda", "Kendua", "Khaliajuri", "Madan", "Mohanganj", "Netrokona Sadar", "Purbadhala"] },
  { name: "Nilphamari", thanas: ["Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Nilphamari Sadar", "Saidpur"] },
  { name: "Noakhali", thanas: ["Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Kabir Hat", "Noakhali Sadar", "Senbagh", "Sonaimuri", "Subarnachar"] },
  { name: "Pabna", thanas: ["Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Pabna Sadar", "Santhia", "Sujanagar"] },
  { name: "Panchagarh", thanas: ["Atwari", "Boda", "Debiganj", "Panchagarh Sadar", "Tetulia"] },
  { name: "Patuakhali", thanas: ["Bauphal", "Dashmina", "Dumki", "Galachipa", "Kalapara", "Mirzaganj", "Patuakhali Sadar", "Rangabali"] },
  { name: "Pirojpur", thanas: ["Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Pirojpur Sadar", "Zianagar"] },
  { name: "Rajbari", thanas: ["Baliakandi", "Goalandaghat", "Kalukhali", "Pangsha", "Rajbari Sadar"] },
  { name: "Rajshahi", thanas: ["Bagha", "Bagmara", "Boalia", "Charghat", "Durgapur", "Godagari", "Matihar", "Mohanpur", "Paba", "Puthia", "Rajpara", "Shah Makhdum", "Tanore"] },
  { name: "Rangamati", thanas: ["Bagaichhari", "Barkal", "Belaichhari", "Juraichhari", "Kaptai", "Kawkhali", "Langadu", "Naniarchar", "Rajasthali", "Rangamati Sadar"] },
  { name: "Rangpur", thanas: ["Badarganj", "Gangachhara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Rangpur Sadar", "Taraganj"] },
  { name: "Satkhira", thanas: ["Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Satkhira Sadar", "Shyamnagar", "Tala"] },
  { name: "Shariatpur", thanas: ["Bhedarganj", "Damudya", "Gosairhat", "Naria", "Shariatpur Sadar", "Zanjira"] },
  { name: "Sherpur", thanas: ["Jhenaigati", "Nakla", "Nalitabari", "Sherpur Sadar", "Sreebardi"] },
  { name: "Sirajganj", thanas: ["Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Raiganj", "Shahjadpur", "Sirajganj Sadar", "Tarash", "Ullahpara"] },
  { name: "Sunamganj", thanas: ["Bishwamvarpur", "Chhatak", "Derai", "Dharamapasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Shalla", "South Sunamganj", "Sulla", "Sunamganj Sadar", "Tahirpur"] },
  { name: "Sylhet", thanas: ["Balaganj", "Beanibazar", "Bishwanath", "Companigonj", "Dakshin Surma", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Osmani Nagar", "Sylhet Sadar", "Zakiganj"] },
  { name: "Tangail", thanas: ["Basail", "Bhuapur", "Delduar", "Dhanbari", "Ghatail", "Gopalpur", "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur", "Tangail Sadar"] },
  { name: "Thakurgaon", thanas: ["Baliadangi", "Haripur", "Pirganj", "Ranisankail", "Thakurgaon Sadar"] },
]

export const DISTRICT_NAMES = BANGLADESH_DISTRICTS.map((d) => d.name)

/** Returns the thanas for a given district name. */
export function getThanasForDistrict(districtName: string): string[] {
  return BANGLADESH_DISTRICTS.find((d) => d.name === districtName)?.thanas ?? []
}
