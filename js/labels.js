(function () {
  const CALLS = {
    "pf-rings": {
      name: "Malaria (falciparum rings)",
      scientific: "Plasmodium falciparum ring trophozoites",
      chart: "malaria",
      about: "Falciparum is the species that kills. It sequesters in deep vessels, so you may see only rings and a few crescents on the smear while the real load sits in brain and viscera. Laveran saw these parasites in 1880; Ross later proved the mosquito. Multiple rings in one cell and appliqué forms are the smear's warning that this is not vivax."
    },
    "pf-gam": {
      name: "Malaria (falciparum crescents)",
      scientific: "Plasmodium falciparum gametocytes",
      chart: "malaria",
      about: "The banana gametocyte is the sexual stage that a mosquito must swallow to continue the cycle. It appears late, often after rings have been treated, and it does not itself make people as sick as the asexual load. No other human malaria makes this shape. If you see crescents, the species call is over."
    },
    "p-vivax": {
      name: "Malaria (vivax)",
      scientific: "Plasmodium vivax",
      chart: "malaria",
      about: "The 'benign tertian' malaria of older books — except it is not always benign. Hypnozoites sleep in the liver and relapse months later; that is why primaquine exists. It prefers young red cells, so the infected cell swells and dots (Schüffner). Geography used to be temperate as well as tropical; Duffy-negative red cells in much of West Africa resist it."
    },
    "p-malariae": {
      name: "Malaria (malariae / band forms)",
      scientific: "Plasmodium malariae",
      chart: "malaria",
      about: "Quartan malaria: fever every 72 hours, a low-grade chronic infection that can smolder for decades. It likes older red cells, so the host cell stays small. The band trophozoite is the textbook picture. In Southeast Asia, P. knowlesi can look identical and is the one that can surge and kill — PCR is the honest split."
    },
    "p-ovale": {
      name: "Malaria (ovale)",
      scientific: "Plasmodium ovale",
      chart: "malaria",
      about: "The West and Central African cousin of vivax: also tertian, also able to relapse from liver hypnozoites, also Schüffner-dotted. The oval, fringed red cell is the smear hint. It is uncommon, easy to under-call as vivax, and still needs radical cure if you want the patient to stay well."
    },
    babesia: {
      name: "Babesiosis (Maltese-cross rings)",
      scientific: "Babesia microti",
      about: "A tick-borne cousin of malaria, named for Victor Babeș. In the northeast United States it rides Ixodes with Lyme. No pigment, no travel-to-tropics story, and a Maltese-cross tetrad when you are lucky. Asplenic, elderly, and immunocompromised people can die of it; the rest often have a flu-like illness that looks like 'malaria at home.'"
    },
    "t-cruzi": {
      name: "Chagas disease (kissing-bug parasite)",
      scientific: "Trypanosoma cruzi",
      about: "Carlos Chagas described this in Brazil in 1909: a reduviid bug defecates trypanosomes that enter a bite or mucosa. Acute disease can be mild; decades later the same parasite destroys heart muscle and gut. The large kinetoplast is the smear tell. It is the trypanosome of the Americas."
    },
    "t-brucei": {
      name: "Sleeping sickness (African trypanosome)",
      scientific: "Trypanosoma brucei",
      about: "Tsetse-fly disease of sub-Saharan Africa. T. b. gambiense is the slow West and Central African form; rhodesiense is the East African one that can kill in weeks. The name is the late CNS stage — somnolence, then death if untreated. Winterbottom's cervical nodes and a chancre are clinical clues; the small kinetoplast is the smear one."
    },
    leishmania: {
      name: "Leishmaniasis (amastigotes)",
      scientific: "Leishmania donovani amastigotes",
      about: "Sand-fly disease. Cutaneous ulcers, mucocutaneous destruction, or visceral kala-azar (fever, huge spleen, pancytopenia) depending on species and host. The amastigote lives inside macrophages. William Leishman and Charles Donovan both saw these bodies around 1903. The kinetoplast is how you refuse to call it Histoplasma."
    },
    giardia: {
      name: "Giardiasis (owl-face parasite)",
      scientific: "Giardia lamblia (G. intestinalis / G. duodenalis)",
      about: "Antonie van Leeuwenhoek probably saw this in his own stool in 1681. It sits on the small-bowel brush border and steals surface area, so the illness is greasy diarrhea, bloating, and malabsorption — classically after camping or daycare. The two nuclei make the 'face.' There is no tissue invasion; the damage is mechanical and inflammatory."
    },
    "e-histolytica": {
      name: "Amebiasis (ameba eating red cells)",
      scientific: "Entamoeba histolytica trophozoite",
      about: "The ameba that earns its name: histo-lytic, tissue-dissolving. It flasks the colon and can seed the liver. Ingested red cells in a trophozoite are the old-school proof you are not looking at harmless E. coli. Most Entamoeba in stool worldwide are E. dispar, which looks the same and does nothing — antigen or PCR decides when the smear is not enough."
    },
    cryptosporidium: {
      name: "Cryptosporidiosis (tiny acid-fast eggs)",
      scientific: "Cryptosporidium oocysts",
      about: "A chlorine-resistant waterborne coccidian. Healthy people get a miserable week of watery diarrhea; people with low CD4 counts can waste and die. The 1993 Milwaukee outbreak taught cities that filters matter. Modified acid-fast is how the lab sees 4–6 µm spheres that ordinary stains miss. Nitazoxanide helps some; immune reconstitution helps more."
    },
    toxoplasma: {
      name: "Toxoplasmosis (crescent parasites)",
      scientific: "Toxoplasma gondii tachyzoites",
      about: "A cat-gut coccidian that infects almost any warm animal. Most healthy adults never notice. The danger is the fetus (congenital disease) and the brain of someone with AIDS or a transplant, where bradyzoite cysts wake up. The tachyzoite is a crescent with no kinetoplast. Nicolle and Manceaux found it in a gundi in 1908; the name is from toxon, bow."
    },
    "s-haematobium": {
      name: "Schistosomiasis (egg with a terminal spine)",
      scientific: "Schistosoma haematobium egg",
      about: "The bladder fluke of Africa and the Middle East. Cercariae from freshwater snails pierce skin; adults live in pelvic veins and dump eggs through the bladder wall. Hematuria, fibrosis, and squamous-cell carcinoma of the bladder are the long game. Theodor Bilharz saw it in Cairo in 1851. The terminal spine is the species stamp; urine is the specimen."
    },
    ascaris: {
      name: "Roundworm (thick-shelled egg)",
      scientific: "Ascaris lumbricoides egg",
      about: "The large human roundworm: 15–35 cm adults in the small bowel, one of the world's commonest infections. Eggs leave in stool, mature in soil, and are swallowed; larvae tour the lungs (Loeffler) before returning to the gut. A heavy load can obstruct or migrate into ducts. The mammillated egg is built to wait in dirt for years."
    },
    trichuris: {
      name: "Whipworm (barrel-shaped egg)",
      scientific: "Trichuris trichiura egg",
      about: "Named for the whip-shaped adult: a thin head threaded into the colonic mucosa and a thick free tail. Heavy infections, especially in children, cause diarrhea, anemia, and a rectal prolapse that looks like a nightmare. The barrel egg with two plugs is unmistakable once you have seen one. Soil-transmitted, like Ascaris and hookworm."
    },
    hookworm: {
      name: "Hookworm (thin-shelled egg)",
      scientific: "Necator americanus / Ancylostoma duodenale egg",
      about: "Larvae in warm soil pierce bare feet. Adults latch onto jejunal mucosa and drink blood — the quiet cause of iron-deficiency anemia in much of the tropics. Necator and Ancylostoma eggs look the same; you cannot speciate from the smear. The thin shell and morula are the call. Shoes and sanitation end the cycle."
    },
    pinworm: {
      name: "Pinworm (D-shaped egg)",
      scientific: "Enterobius vermicularis egg",
      about: "The childhood itch. Gravid females crawl out at night and glue eggs to the perianal skin; the child scratches and reseeds the family. Stool examination misses most cases — that is why the tape test exists. The egg is flattened on one side, built to stick. It is cosmopolitan, not a tropical-only worm."
    },
    strongyloides: {
      name: "Threadworm (gut larva)",
      scientific: "Strongyloides stercoralis rhabditiform larva",
      about: "The worm that can complete its life cycle inside one person. Autoinfection lets it persist for decades, then explode when steroids or HTLV-1 knock down control — hyperinfection, gram-negative sepsis, larvae in sputum. Eggs usually hatch in the gut, so you look for larvae, not eggs. The short buccal canal is how you refuse to call it hookworm."
    },
    trichinella: {
      name: "Trichinellosis (coiled worm in muscle)",
      scientific: "Trichinella spiralis",
      about: "Undercooked pork or game. Adults in the gut shed larvae that encyst in striated muscle — extraocular, tongue, diaphragm. Fever, myalgia, eosinophilia, and periorbital edema are the clinical cluster. The nurse-cell cyst is the histologic one. Cooking and freezing break the cycle; tasting raw sausage does not."
    },
    taenia: {
      name: "Tapeworm (striated egg)",
      scientific: "Taenia species egg",
      about: "Beef tapeworm (T. saginata) is mostly a nuisance. Pork tapeworm (T. solium) is the one that cysts the brain — cysticercosis — if humans swallow the egg instead of the cyst. The eggs look identical: a brown striated ball with six hooks inside. Speciation needs the scolex or gravid proglottid, not this field."
    },
    microfilaria: {
      name: "Filariasis (worm in blood)",
      scientific: "Microfilaria",
      about: "Larval nematodes in blood, headed for a mosquito or fly. Wuchereria and Brugia cause lymphatic filariasis (elephantiasis); Loa loa crosses the eye; Onchocerca is in skin, not usually blood. Speciation is sheath, tail nuclei, and what time you drew the blood. Manson discovered mosquito transmission here before Ross did it for malaria."
    },
    trichomonas: {
      name: "Trichomoniasis (flagellate)",
      scientific: "Trichomonas vaginalis",
      about: "The commonest curable STI in many clinics. It inflames vagina and urethra; men are often quiet carriers. There is no cyst — it dies as the smear dries — so a warm wet mount or a molecular test beats a cold slide. Donné described it in 1836. Pear shape, one nucleus, undulating membrane: not a sperm, not Giardia."
    },
    cyclospora: {
      name: "Cyclosporiasis (larger acid-fast egg)",
      scientific: "Cyclospora cayetanensis",
      about: "A food-borne coccidian of raspberries, herbs, and travel. Watery diarrhea that can last weeks in an immunocompetent host; the oocyst needs time in the environment before it infects, so person-to-person spread is uncommon. It is bigger than Cryptosporidium and pickier about taking up acid-fast stain. Measure, then call."
    },
    "loa-loa": {
      name: "Loiasis (eye worm in blood)",
      scientific: "Loa loa",
      about: "The African eyeworm: a deer-fly (Chrysops) disease of rainforest West and Central Africa. Calabar swellings and a worm crossing the conjunctiva are the stories people remember. Microfilariae are diurnal and sheathed, with nuclei to the tail tip. The practical fear is treating onchocerciasis with ivermectin when the Loa load is high — encephalopathy."
    },
    sarcocystis: {
      name: "Sarcocystosis (cyst in muscle)",
      scientific: "Sarcocystis",
      about: "A coccidian with a two-host life: predator gut, prey muscle. Humans can be either, depending on the species and the meal. Muscle cysts are large, septate, and thick-walled compared with Trichinella's coiled nurse cell. Most incidental cysts in human muscle are silent; the gut form is a food-borne diarrhea after undercooked meat."
    },
    tb: {
      name: "Tuberculosis (acid-fast rods)",
      scientific: "Mycobacterium tuberculosis",
      about: "Koch's bacillus (1882). Mycolic acids in the wall shrug off Gram stain and hold carbol fuchsin through acid-alcohol — that is all 'acid-fast' means. Morphology cannot speciate; MAC and others look the same. One smear can start isolation and treatment, but culture or NAAT still owns the name. Nocardia is the branching, weakly acid-fast trap."
    },
    "s-pneumoniae": {
      name: "Pneumonia (lancet-shaped diplococci)",
      scientific: "Streptococcus pneumoniae",
      about: "Still a leading cause of community pneumonia, meningitis, and otitis. The capsule is the virulence trick and the vaccine target; on Gram stain it is the clear halo around a lancet pair. Pasteur and Sternberg saw it in the 1880s. Rusty sputum is folklore; the smear plus a sick lobe is still a fair bedside call."
    },
    "s-aureus": {
      name: "Staph infection (grape-cluster cocci)",
      scientific: "Staphylococcus aureus",
      about: "Ogston named it for grape clusters (staphyle). It lives in noses and on skin, then invades wounds, bone, heart valves, and blood. You cannot tell aureus from coagulase-negative staph on Gram stain — clusters vs chains is the useful split, not species. MRSA is a resistance story, not a different shape."
    },
    "n-gonorrhoeae": {
      name: "Gonorrhea (kidney-bean diplococci)",
      scientific: "Neisseria gonorrhoeae",
      about: "Neisser's diplococcus (1879). In a symptomatic man's urethra, intracellular kidney-bean Gram-negatives are highly predictive. Women, extragenital sites, and children need culture or NAAT — lookalikes and legal stakes. Meningococcus and Moraxella wear the same coat on Gram. Untreated, it can seed joints and, in the newborn, eyes."
    },
    "c-tetani": {
      name: "Tetanus (drumstick rods)",
      scientific: "Clostridium tetani",
      about: "A soil anaerobe whose toxin, not the bug load, does the killing — lockjaw, spasms, broken bones. The terminal spore swells the rod into a drumstick. You almost never diagnose tetanus from a smear of a wound; you diagnose it from the patient. The picture exists so you remember what you are vaccinating against."
    },
    "h-pylori": {
      name: "Stomach ulcer bug (corkscrew rods)",
      scientific: "Helicobacter pylori",
      about: "Marshall and Warren turned 'stress ulcers' into an infection and won a Nobel. The spiral lives in gastric mucus, makes urease to survive acid, and drives gastritis, peptic ulcers, and a share of gastric cancer and MALT lymphoma. Giemsa, silver, or IHC on a biopsy is how histology sees it. Treat the organism, not only the hole."
    },
    candida: {
      name: "Candidiasis (yeast with pseudohyphae)",
      scientific: "Candida albicans",
      about: "A normal mouth-and-gut yeast that becomes disease when barriers or immunity fail — thrush, vaginitis, catheter line, deep viscera. Pseudohyphae are the tissue-invasion hint. Species (albicans vs glabrata vs auris) is culture or MALDI, not this field. The name is from the Latin for shining white."
    },
    aspergillus: {
      name: "Aspergillosis (45-degree mold)",
      scientific: "Aspergillus fumigatus",
      about: "A ubiquitous mold. In a cavity it can sit as a fungus ball; in a neutropenic or transplant lung it invades vessels and infarcts tissue. Micheli named the fruiting head for a holy-water sprinkler (aspergillum) in 1729. Acute-angle septate hyphae are the histologic call; Fusarium will not let you be sure without culture."
    },
    "c-neoformans": {
      name: "Cryptococcosis (capsule yeast)",
      scientific: "Cryptococcus neoformans",
      about: "A pigeon-guano yeast that likes lungs and, especially, meninges. The capsule hides it from phagocytes and clears on India ink; mucicarmine paints it red. C. gattii is the tree-associated cousin that can floor the immunocompetent. AIDS made this a daily CSF call. Narrow-based budding, no true hyphae."
    },
    blastomyces: {
      name: "Blastomycosis (broad-based budding)",
      scientific: "Blastomyces dermatitidis",
      about: "A dimorphic of moist North American soil (and a few other pockets). You breathe mycelium; in tissue it becomes a thick-walled yeast that buds with a broad neck. Lung disease plus skin and bone lesions is the classic trek. Gilchrist described it in 1894. The double-contour wall is the smear's gift."
    },
    coccidioides: {
      name: "Valley fever (spherules)",
      scientific: "Coccidioides immitis / C. posadasii",
      about: "Dust of the American Southwest and parts of Latin America. Most infections are a flu; a few disseminate to skin, bone, and meninges, especially in Filipino, African, and pregnant patients. In tissue there is no yeast bud — only spherules packed with endospores. 'Coccidioides' was a mistaken guess that it was a protozoan."
    },
    pneumocystis: {
      name: "PCP (cup-shaped cysts)",
      scientific: "Pneumocystis jirovecii",
      about: "Once filed as a parasite, now a fungus that will not culture on ordinary media. It fills alveoli with a foamy exudate in AIDS, transplants, and high-dose steroids. Otto Jírovec's name replaced carinii for the human species. GMS shows crushed ping-pong-ball cysts; they do not bud. Prophylaxis with TMP-SMX changed the epidemic."
    },
    cmv: {
      name: "CMV (owl-eye cell)",
      scientific: "Cytomegalovirus inclusions",
      about: "A herpesvirus most adults already carry. Disease is the immunocompromised: retinitis, colitis, pneumonitis, and the transplanted organ. The cell swells (cyto-megalo) around a nuclear inclusion with a halo — Goodpasture's owl eye — plus granular cytoplasmic inclusions. IHC is faster than arguing with HSV on H&E."
    },
    histoplasma: {
      name: "Histoplasmosis (tiny intracellular yeast)",
      scientific: "Histoplasma capsulatum",
      about: "Darling found this in Panama in 1906 and thought it was a protozoan in tissue (histo-plasma). It is a dimorphic of bird- and bat-rich soil, especially the Ohio and Mississippi valleys and much of Latin America and Africa. You breathe it; macrophages swallow 2–4 µm yeasts. No kinetoplast, GMS-positive, narrow bud — that is the fight with Leishmania."
    },
    listeria: {
      name: "Listeriosis (rods in pairs)",
      scientific: "Listeria monocytogenes",
      about: "A cold-tolerant food-borne rod: soft cheese, deli meat, unwashed vegetables. Healthy people may see nothing; pregnant people, neonates, and the elderly get bacteremia and meningitis. It tumbles on a wet mount and can look like a diphtheroid or a pneumococcus on a careless Gram. The name honors Joseph Lister; the danger is the host, not a unique shape."
    },
    "h-influenzae": {
      name: "Haemophilus (tiny Gram-negative rods)",
      scientific: "Haemophilus influenzae",
      about: "Pfeiffer's bacillus, wrongly blamed for the 1918 influenza. It is a fastidious coccobacillus of otitis, sinusitis, and — before Hib vaccine — childhood meningitis and epiglottitis. 'Haemophilus' means blood-loving: it wants X and V factors. On Gram stain it is a faint small rod you can miss if the safranin is weak."
    },
    borrelia: {
      name: "Relapsing fever (spirochetes)",
      scientific: "Borrelia",
      about: "Spirochetes loose in the blood, not hidden in tissue like T. pallidum. Louse-borne B. recurrentis and tick-borne species cause waves of fever as the surface proteins change. The smear between fevers can be empty. They are longer and coarser than a leptospire, and they have no kinetoplast — that is how you refuse a trypanosome."
    },
    mucor: {
      name: "Mucormycosis (ribbon mold)",
      scientific: "Mucorales",
      about: "The emergency mold of diabetic ketoacidosis, iron overload, and profound neutropenia: rhino-orbital-cerebral disease that ignores tissue planes and invades arteries. Hyphae are broad, pale, and almost septate-free, branching at right angles. Amphotericin and surgery, not 'watch the culture.' Fusarium and Aspergillus are the histologic arguments."
    },
    sickle: {
      name: "Sickle cell disease (pointed red cells)",
      scientific: "Drepanocytes",
      about: "A single amino-acid change in beta globin (Glu→Val) lets deoxygenated hemoglobin polymerize and warp the cell. Herrick published the smear in 1910; Pauling called it a molecular disease in 1949. The pointed drepanocyte is irreversible. Pain crises, chest syndrome, stroke, and hyposplenism are the clinical bill. Trait is mostly silent; SC and S-beta-thal make fatter boats and more targets."
    },
    aml: {
      name: "Leukemia (AML)",
      scientific: "Acute myeloid leukemia",
      chart: "leukemia",
      about: "A marrow taken over by myeloid blasts — days to weeks of fatigue, infection, and bleeding. Auer rods, if present, end the AML-vs-ALL argument on the smear. WHO now splits it by genetics (PML::RARA, NPM1, and the rest), because the karyotype is the prognosis. It is a disease of older adults more than children, the reverse of ALL."
    },
    cll: {
      name: "Leukemia (CLL)",
      scientific: "Chronic lymphocytic leukemia",
      chart: "leukemia",
      about: "The commonest adult leukemia in the West: a long-lived B-cell clone that accumulates rather than explodes. Many people are found on a routine blood count. Smudge cells are the smear's gossip; flow (CD5, CD23, dim sIg) is the proof. Mantle cell wears a similar coat and a worse temper — cyclin D1 before you reassure anyone."
    },
    cml: {
      name: "Leukemia (CML)",
      scientific: "Chronic myeloid leukemia",
      chart: "leukemia",
      about: "Nowell and Hungerford's Philadelphia chromosome (1960), later BCR::ABL1: a tyrosine-kinase fusion that floods the blood with every stage of granulocyte, plus basophils. Chronic-phase disease can look like a 'high white count' for months. Imatinib turned a fatal grind into a pill. Leukemoid reactions copy the left shift and fail the basophil-and-PCR test."
    },
    all: {
      name: "Leukemia (ALL)",
      scientific: "Acute lymphoblastic leukemia",
      chart: "leukemia",
      about: "The childhood leukemia that chemotherapy learned to cure, and a worse disease in adults. Lymphoblasts crowd marrow and often meninges; they have no Auer rods. Lineage (B vs T) and genetics (ETV6::RUNX1, BCR::ABL1, hypodiploidy) decide the protocol. A reactive lymphocytosis is pleomorphic and belongs to a viral story, not a monotone blast field."
    },
    spherocytes: {
      name: "Spherocytosis (sphere-shaped red cells)",
      scientific: "Spherocytes",
      about: "Lose membrane, keep volume, become a dense ball with no central pallor. Hereditary spherocytosis is a cytoskeleton defect (ankyrin, spectrin, band 3) that the spleen then pits; immune hemolysis (warm IgG) can look identical on the smear. The lab call is 'spherocytes present.' The clinical call is family, DAT, and how sick the patient is. Thick smears fake them."
    },
    "target-cells": {
      name: "Target cells (bull's-eye red cells)",
      scientific: "Codocytes",
      about: "Extra membrane relative to hemoglobin, so a blob of pigment sits in the middle of the pallor. Think thalassemia, hemoglobin C, liver disease (too much membrane), or no spleen (too little remodeling). The name codocyte is from Greek kodon, bell. A slowly dried smear manufactures a tray of false targets — always read a well-made zone."
    },
    "auer-rod": {
      name: "Leukemia (AML with Auer rod)",
      scientific: "Myeloblast with Auer rod",
      chart: "leukemia",
      about: "John Auer described these needles in 1906. They are crystallized myeloid primary granules. One rod in a blast is AML (or high-grade MDS) until proven otherwise. Bundles — faggot cells — scream acute promyelocytic leukemia, the subtype that clots and bleeds and needs all-trans retinoic acid now, not after the karyotype comes back."
    },
    "reed-sternberg": {
      name: "Hodgkin lymphoma (Reed–Sternberg cell)",
      scientific: "Reed–Sternberg cell",
      about: "Dorothy Reed (1902) and Carl Sternberg described the owl-eyed giant that defines classical Hodgkin. It is a crippled B cell that has lost much of its B-ness (CD15/CD30, usually CD20/CD45 negative) and lives in a crowd of reactive inflammatory cells. The patient feels that inflammation: nodes, fever, night sweats. One cell does not make the diagnosis; the architecture does."
    },
    hepatocytes: {
      name: "Hepatitis B (ground-glass liver cells)",
      scientific: "Ground-glass hepatocytes",
      about: "Hadziyannis and Popper's name for hepatocytes stuffed with HBsAg in chronic hepatitis B — a finely granular, pale-eosinophilic cytoplasm that looks like frosted glass. It is a marker of a long-standing infection, not of grade alone. Orcein or HBsAg IHC confirms. Oncocytes and Lafora bodies are the adult lookalikes; the serology is the referee."
    },
    hyperseg: {
      name: "B12 / folate deficiency (hypersegmented neutrophil)",
      scientific: "Hypersegmented neutrophil",
      chart: "wbc",
      about: "A neutrophil with six or more lobes, or many with five: the smear's oldest hint of megaloblastic anemia. DNA synthesis lags, so nuclear segmentation overshoots. B12 and folate deficiency are the classic causes; drugs that wreck DNA (methotrexate, hydroxyurea) copy it. Find the neutrophil, then find the oval macrocytes and the reason."
    },
    rouleaux: {
      name: "Paraprotein (stacked red cells)",
      scientific: "Rouleaux",
      about: "Red cells stacked like coins when plasma protein — especially a myeloma or Waldenström paraprotein — dulls their surface charge. High fibrinogen in inflammation can do a milder version. True agglutination is a lumpy, disordered clump (cold agglutinin), not a neat stack. The smear edge always stacks a little; read the body of the film."
    },
    schistocytes: {
      name: "TTP (broken red cells)",
      scientific: "Schistocytes (microangiopathic hemolysis)",
      chart: "maha",
      about: "Helmet cells and red-cell fragments from a fibrin or platelet mesh that shears them in small vessels. TTP is ADAMTS13 failure and a hematologic emergency (plasma exchange). HUS, DIC, malignant hypertension, and a mechanical valve tell the same smear story with different plots. One or two fragments are not a call; a field of them plus thrombocytopenia is."
    },
    neutrophil: {
      name: "Neutrophil (most common white cell)",
      scientific: "Segmented neutrophil (polymorphonuclear leukocyte)",
      chart: "wbc",
      about: "Paul Ehrlich named these cells in the 1870s because their granules took up neither acid nor basic dyes — they were 'neutral.' They are the first wave against bacteria: they crawl out of vessels, swallow organisms, and can throw out DNA nets (NETs). A mature cell has a 3–5 lobed nucleus; that is why older texts call them polymorphs or PMNs. Typical adult blood: about 40–70% of white cells."
    },
    eosinophil: {
      name: "Eosinophil (allergy and parasite cell)",
      scientific: "Eosinophil",
      chart: "wbc",
      about: "Ehrlich named them for eosin, the acid-red dye their granules drink. The usual job is helminths and allergic inflammation — asthma, eczema, drug rash. Two nuclear lobes and coarse orange granules are the smear call. They are a small slice of the differential, about 1–4% in health. Do not confuse toxic neutrophils (darker, finer granules) with a true eosinophil."
    },
    basophil: {
      name: "Basophil (rarest white cell)",
      scientific: "Basophil",
      chart: "wbc",
      about: "The rarest circulating white cell, usually under 1%. Ehrlich named it for granules that bind basic dyes and often hide the nucleus. Those granules hold histamine and heparin; the cell sits in the same allergy and helminth story as the mast cell, which lives in tissue rather than blood. A dirty, overstained neutrophil is the usual false call."
    },
    lymphocyte: {
      name: "Lymphocyte (immune memory cell)",
      scientific: "Lymphocyte",
      chart: "wbc",
      about: "The name is from Latin lympha, water — cells of the lymph. On a smear you cannot split T, B, and NK; that takes markers. They run adaptive memory: antibodies, killing, and regulation. A resting cell is small, with a round dense nucleus and a thin rim of blue cytoplasm. They are the second-largest slice of a normal adult differential, about 20–40%."
    },
    monocyte: {
      name: "Monocyte (macrophage precursor)",
      scientific: "Monocyte",
      chart: "wbc",
      about: "Largest white cell in ordinary blood. Metchnikoff's mononuclear phagocyte idea still holds: once it leaves the vessel it becomes a macrophage or a dendritic cell and eats debris, organisms, and dead tissue. The nucleus is folded or kidney-shaped; the cytoplasm is dull blue-gray, sometimes with vacuoles. About 2–8% of adult white cells. A reactive lymphocyte can mimic the size; the nucleus and cytoplasm texture usually settle it."
    },
    megakaryocyte: {
      name: "Megakaryocyte (platelet factory)",
      scientific: "Megakaryocyte",
      about: "The largest cell in normal marrow. James Homer Wright watched platelets bud from its cytoplasm; that is still how we teach thrombopoiesis. The nucleus is one polyploid mass, not a handful of separate nuclei — that is how you beat an osteoclast. It does not circulate. If you see one, you are in marrow, or a smear contaminated with marrow."
    },
    sperm: {
      name: "Sperm (male gamete)",
      scientific: "Spermatozoon",
      about: "The only human cell built to swim. A compact head (nucleus plus acrosome), a midpiece packed with mitochondria, and a flagellum. Leeuwenhoek saw them in 1677 and called them animalcules. On a wet prep the motion is the giveaway; on a stained slide, do not call a detached cilium or a Trichomonas a sperm."
    },
    adipose: {
      name: "Fat (adipose tissue)",
      scientific: "White adipose tissue",
      about: "A signet-ring cell: one lipid droplet pushes a flat nucleus to the rim. White fat stores energy and cushions organs; brown fat, which you will not usually be shown here, burns fuel for heat. Empty spaces on H&E are the lipid dissolved in processing. Sebaceous glands have foamy, multilocular cytoplasm, not one clear hole."
    },
    alveoli: {
      name: "Lung (air sacs)",
      scientific: "Pulmonary alveoli",
      about: "Thin-walled air rooms where gas crosses into blood. Type I pneumocytes make the sheet; type II cells make surfactant and can rebuild the lining. A normal septum is delicate, with a capillary in it. Emphysema destroys those walls. Thyroid follicles look vaguely similar at low power but hold colloid, not air, and have a cuboidal epithelium."
    },
    cardiac: {
      name: "Heart muscle (cardiac)",
      scientific: "Cardiac muscle (myocardium)",
      about: "Striated like skeletal muscle, but the cells are branched and joined by intercalated discs — the electrical and mechanical handshake of the heartbeat. Nuclei sit in the center, not at the edge. Purkinje fibers of the conduction system are paler and larger. Smooth muscle has no striations; skeletal muscle has peripheral nuclei and no discs."
    },
    "compact-bone": {
      name: "Compact bone (osteons)",
      scientific: "Haversian bone (osteons)",
      about: "Clopton Havers described these rings in the 1600s. Each osteon is a Haversian canal (vessels) wrapped in concentric lamellae, with osteocytes in lacunae linked by canaliculi. That is living bone, not a rock. Cementum and dentin can mimic the rings in a jaw section; context and the canal pattern usually decide."
    },
    epidermis: {
      name: "Skin (epidermis)",
      scientific: "Keratinized stratified squamous epithelium",
      about: "A waterproof stack: basal cells divide, spinous cells knit together, the granular layer seals, and the stratum corneum is dead keratin. Melanocytes sit in the basal layer. Mucosa that looks squamous usually lacks a true granular layer and a compact cornified sheet. This is a barrier and a vitamin D factory, not just 'skin.'"
    },
    glomerulus: {
      name: "Kidney filter (glomerulus)",
      scientific: "Renal glomerulus",
      about: "A tuft of capillaries shoved into Bowman's capsule. Plasma is filtered through endothelium, basement membrane, and podocyte slits — that is how the body starts making urine. Malpighi saw these bodies in the 1600s. An islet of Langerhans can fool you at low power; it has no capsule space and lives in pancreas, not cortex."
    },
    goblet: {
      name: "Goblet cell (mucus cell)",
      scientific: "Goblet cell",
      about: "Named for the wine-glass shape: a theca of mucin and a compressed basal nucleus. They lubricate gut and airway. PAS or mucicarmine makes the mucin shout. A signet-ring carcinoma cell is the malignant mimic — wrong architecture, wrong company, and often a dirty nucleus. Paneth cells sit at crypt bases and hold red enzyme granules, not pale mucin."
    },
    cartilage: {
      name: "Hyaline cartilage (joint cartilage)",
      scientific: "Hyaline cartilage",
      about: "Glass-smooth cartilage of joints, ribs, and airway rings. Chondrocytes live in lacunae inside a clean basophilic matrix. Elastic cartilage adds dark fibers (ear, epiglottis). Fibrocartilage is tougher and more collagenous (disc, meniscus). The name hyaline is from Greek hyalos, glass."
    },
    purkinje: {
      name: "Purkinje cell (cerebellum neuron)",
      scientific: "Cerebellar Purkinje cell",
      about: "Jan Evangelista Purkyně described these flask-shaped neurons in 1837. They sit in a single row between the molecular and granular layers and send a huge dendritic tree into the molecular layer — the output of the cerebellar cortex. A Betz cell is a giant pyramidal neuron in motor cortex, not in this sandwich."
    },
    skeletal: {
      name: "Skeletal muscle (voluntary muscle)",
      scientific: "Skeletal (striated) muscle",
      about: "Long fibers with regular A and I bands — the striations that let you pull on a bone. Nuclei are many and peripheral, pushed aside by myofibrils. Cardiac muscle is also striated but branched, with central nuclei and intercalated discs. Smooth muscle has no stripes. Cross-section looks like a packed polygon field with edge nuclei."
    },
    thyroid: {
      name: "Thyroid (colloid follicles)",
      scientific: "Thyroid follicles",
      about: "Spheres of cuboidal epithelium around stored thyroglobulin (colloid). That store is how the gland keeps T3 and T4 ready. C cells sit between follicles and make calcitonin; you will not see them easily on H&E. Alveoli are the classic low-power lookalike: they hold air, not pink colloid, and their lining is flattened."
    },
    islet: {
      name: "Pancreas (islet of Langerhans)",
      scientific: "Islet of Langerhans",
      about: "Paul Langerhans, still a student in 1869, saw pale islands in the pancreas. They are endocrine: insulin, glucagon, somatostatin, and a few others, packed into a capillary-rich nest among acini. A glomerulus has a capsule and urinary space. A lymphoid aggregate has lymphocytes, not pale endocrine cells."
    },
    respiratory: {
      name: "Airway lining (ciliated epithelium)",
      scientific: "Pseudostratified ciliated respiratory epithelium",
      about: "A mucociliary escalator: goblet cells make mucus, cilia sweep it up. Nuclei sit at different heights, so the sheet looks stratified, but every cell touches the basement membrane — hence 'pseudostratified.' Fallopian tube epithelium is also ciliated but lacks this airway mix of goblet cells. Smoking first takes the cilia, then the cell type."
    },
    "smooth-muscle": {
      name: "Smooth muscle (involuntary muscle)",
      scientific: "Smooth muscle",
      about: "The muscle of gut, vessel, uterus, and airway — no voluntary control, no striations. Spindle cells with a single central cigar-shaped nucleus. Sheets and bundles, not long peripheral-nucleated fibers. A nerve has axons and myelin, not a field of contractile cytoplasm. Dense fibrous tissue is collagen, not cells packed this tightly."
    },
    "lymph-node": {
      name: "Lymph node (immune filter)",
      scientific: "Lymph node",
      about: "A bean-shaped filter on the lymphatic chain. Cortex holds B-cell follicles, paracortex holds T cells, and the medulla has cords and sinuses. Lymph arrives in an afferent vessel, percolates, and leaves at the hilum. Spleen has red pulp and a central arteriole in white pulp. Tonsil has crypts and a squamous surface."
    },
    "bone-marrow": {
      name: "Bone marrow (blood factory)",
      scientific: "Bone marrow",
      about: "Where blood is made: erythroid islands, myeloid precursors, and megakaryocytes among fat and bony trabeculae. In adults, this factory lives mainly in axial bone. Cellularity falls with age as fat takes the space. A lymph node has no fat-and-bone scaffold. The megakaryocyte is the landmark giant."
    },
    cerebellum: {
      name: "Cerebellum (balance brain)",
      scientific: "Cerebellar cortex",
      about: "A three-layer sandwich you can call from across the room: molecular layer, a Purkinje row, and a dense granular layer. It times movement and balance. Neocortex has six layers and pyramidal cells, not this tidy stack. The name means 'little brain.'"
    },
    neuron: {
      name: "Neuron (nerve cell)",
      scientific: "Neuron",
      about: "The signalling cell of the nervous system: dendrites in, axon out, a large pale nucleus with a prominent nucleolus, and Nissl substance (rough ER) in the cytoplasm. Santiago Ramón y Cajal drew these as separate cells; that is the neuron doctrine. An astrocyte is smaller and has no Nissl. Site tells you CNS versus a peripheral ganglion."
    },
    astrocyte: {
      name: "Astrocyte (brain support cell)",
      scientific: "Astrocyte",
      about: "Star-shaped glia that feed neurons, keep the blood–brain barrier, and scar after injury. On routine stain they often sit in a clear halo. GFAP is the usual stain when you need proof. Oligodendrocytes also halo ('fried egg') but line up in white-matter rows and make myelin. The name is from Greek astron, star."
    },
    osteoclast: {
      name: "Osteoclast (bone-eating cell)",
      scientific: "Osteoclast",
      about: "A macrophage-family giant that etches bone. It sits in a Howship lacuna on a bone surface and has several separate nuclei. A megakaryocyte has one multilobed nucleus and lives in marrow space, not on the bone edge. RANKL signalling drives these cells; bisphosphonates shut them down."
    },
    prostate: {
      name: "Prostate (glands)",
      scientific: "Prostate glands",
      about: "Simple glands in a fibromuscular stroma, often with corpora amylacea — the laminated pink concretions. The job is to add fluid to semen. Seminal vesicle has a more complex, folded epithelium and golden lipofuscin. Architecture, not a single cell, is how you leave benign and enter carcinoma."
    },
    spleen: {
      name: "Spleen (blood filter)",
      scientific: "Spleen",
      about: "Red pulp filters and recycles red cells; white pulp is lymphoid tissue around a central arteriole (the periarteriolar lymphoid sheath). That arteriole in a follicle is the tell. It is the largest lymphoid organ, and the one that sees blood rather than lymph. A node has sinuses and a hilum, not this much blood."
    },
    urothelium: {
      name: "Bladder lining (umbrella cells)",
      scientific: "Urothelium (transitional epithelium)",
      about: "Built to stretch. Several layers, with large umbrella cells on top that can be binucleate. No granular layer, no keratin in the normal state. Older name 'transitional' meant it looked halfway between squamous and columnar. Thickness and atypia are how you leave normal bladder."
    },
    "cyto-nilm": {
      name: "NILM (normal squamous cells)",
      scientific: "Negative for intraepithelial lesion or malignancy",
      chart: "bethesda",
      about: "George Papanicolaou's smear (1940s) is still a screen, not a biopsy. NILM means you saw a healthy or only reactive squamous population — no SIL, no cancer. Superficial cells are flat and orangeophilic; intermediates are cyanophilic with vesicular nuclei. The transformation zone is where the real work happens; these mature cells are the quiet majority of a good smear."
    },
    "cyto-endocx": {
      name: "Endocervical cells (transformation-zone sample)",
      scientific: "Endocervical columnar cells",
      chart: "glandular",
      about: "Mucus-secreting columnar cells from the endocervical canal. A honeycomb or picket-fence strip means the brush reached the transformation zone — the place HPV actually causes trouble. Bethesda no longer fails a smear for missing them, but they still reassure you the sample was not just vaginal wall."
    },
    "cyto-em": {
      name: "Endometrial cells (shed lining)",
      scientific: "Exfoliated endometrial cells",
      chart: "glandular",
      about: "The lining of the uterus sheds into the smear, especially in the first 12 days of the cycle. After 45, or out of cycle, they can be the first hint of an endometrial lesion and Bethesda wants them mentioned. They are smaller and darker than endocervical cells. Most are still benign."
    },
    "cyto-parabasal": {
      name: "Parabasal cells (deep squamous)",
      scientific: "Parabasal squamous cells",
      about: "The least mature squamous cells that normally stay in the deep epithelium. They come off in atrophy, after childbirth, or when the scrape is vigorous. Dense cytoplasm, a round nucleus, no coarse chromatin. The name is anatomic: next to the basal layer. HSIL is the overcall if you only count N/C and ignore nuclear quality."
    },
    "cyto-atrophy": {
      name: "Atrophy (estrogen-poor smear)",
      scientific: "Atrophic cervicovaginal pattern",
      about: "Without estrogen the epithelium thins to parabasal cells. Postmenopause, lactation, and anti-estrogen drugs all do this. The smear looks cellular and 'angry' and fools people into HSIL. A short course of topical estrogen and a repeat smear is the old clinical move when the nuclei are not frankly malignant."
    },
    "cyto-metaplasia": {
      name: "Squamous metaplasia (healing transformation zone)",
      scientific: "Immature squamous metaplasia",
      about: "The transformation zone is where columnar epithelium becomes squamous — that is metaplasia, and it is how the cervix lives with the vaginal environment. Immature metaplastic cells are the most overcalled benign cells on a Pap. They have dense cytoplasm and a decent N/C, but the nucleus is calm. This is repair of a normal process, not a lesion."
    },
    "cyto-lacto": {
      name: "Lactobacilli (normal vaginal rods)",
      scientific: "Lactobacillus (Döderlein bacilli)",
      about: "Albert Döderlein described these rods in 1892. They ferment glycogen to lactic acid and keep the vagina hostile to most pathogens. Seeing them is a health sign, not an infection. When they vanish and coccobacilli take the cell surface, you have left NILM-flora and entered bacterial vaginosis."
    },
    "cyto-cytolysis": {
      name: "Cytolysis (lactobacillus melt)",
      scientific: "Lactobacillus-associated cytolysis",
      about: "A luteal-phase or pregnancy picture: so many lactobacilli that intermediate-cell cytoplasm dissolves and bare nuclei litter the field. It can look necrotic if you do not notice the rods. It is not BV, not a missed period of atrophy, and not a reason to treat. Report it as flora, then move on."
    },
    "cyto-lsil": {
      name: "LSIL (koilocytes)",
      scientific: "Low-grade squamous intraepithelial lesion",
      chart: "bethesda",
      about: "Bethesda lumped HPV effect and CIN 1 because they behave the same: usually transient, driven by productive HPV infection. The koilocyte (from Greek koilos, hollow) is the viral factory — a cavity around an enlarged, irregular nucleus. Most LSIL in young people clears. The job of the smear is to find it; the job of the clinic is not to overtreat it."
    },
    "cyto-hsil": {
      name: "HSIL (high-grade squamous lesion)",
      scientific: "High-grade squamous intraepithelial lesion",
      chart: "bethesda",
      about: "CIN 2 and CIN 3 live here. This is a transforming HPV infection: the cell stays immature and the nucleus goes wrong. Untreated, a share become invasive cancer over years. That is why HSIL is a colposcopy, not a 'see you next year.' The smear can look sparse — a few dark cells — and still be the most important field on the tray."
    },
    "cyto-scc": {
      name: "SCC (invasive squamous cancer)",
      scientific: "Squamous cell carcinoma",
      chart: "bethesda",
      about: "The disease the Pap smear was built to prevent. Most cervical cancers are squamous and HPV-driven. By the time cells are frankly malignant with a tumor diathesis, this is no longer a screening surprise you watch — it is a referral. Keratinizing tumors shed tadpoles and fiber cells; nonkeratinizing ones mimic a very loud HSIL."
    },
    "cyto-adeno": {
      name: "Adenocarcinoma (glandular cancer)",
      scientific: "Adenocarcinoma on Pap test",
      chart: "glandular",
      about: "Glandular cervical cancer has been the rising share as squamous screening got better. It starts in endocervical or endometrial glands and is easier to miss than HSIL — the cells can hide in a strip that still looks 'glandular.' AIS is the in-situ warning. HPV 18 has a particular taste for this pathway. A normal honeycomb does not have nucleoli and chaos."
    },
    "cyto-candida": {
      name: "Candidiasis (yeast on a Pap)",
      scientific: "Candida species on Pap test",
      about: "The same yeast as thrush and vaginitis, caught here as a passenger on a cancer screen. Pseudohyphae spearing cells are the classic Pap picture. It does not cause SIL. Treat if she is symptomatic; do not let the yeast distract you from a koilocyte in the next field."
    },
    "cyto-trich": {
      name: "Trichomoniasis (flagellate on a Pap)",
      scientific: "Trichomonas vaginalis on Pap test",
      about: "A treatable STI that the Pap can diagnose when the organism is crisp. Sensitivity is imperfect — a molecular test is better if you only suspect it — but a definite trich is a definite trich. Partners need treatment or she will be back. The dirty, reactive background is the company it keeps, not a SIL by itself."
    },
    "cyto-bv": {
      name: "BV (clue cells)",
      scientific: "Bacterial vaginosis / clue cells",
      about: "Not one bug: a shift from Lactobacillus to Gardnerella and friends. Gardner and Dukes described clue cells in 1955. The cell is so covered in coccobacilli that its edge disappears. It causes discharge and raises the risk of preterm birth and other infections; it is not a cervical cancer precursor. Few neutrophils — this is not pus."
    },
    "cyto-actinomyces": {
      name: "Actinomyces (cotton-ball filaments)",
      scientific: "Actinomyces-like organisms",
      about: "Filamentous bacteria that colonize a subset of IUD users. The cotton-ball colony is the smear call. True pelvic actinomycosis is rare; most reports are 'organisms consistent with Actinomyces' and a conversation about the IUD, not an automatic trip to theatre. Do not confuse mucus fluff or Candida with this."
    },
    "cyto-hsv": {
      name: "Herpes (3 Ms)",
      scientific: "Herpes simplex cytopathic effect",
      about: "HSV in the cervix or vagina: painful ulcers, and a smear that can make the call before the swab comes back. Multinucleation, molding, margination — the 3 Ms — plus ground-glass nuclei. It is not a SIL and it is not cancer, but it is infectious and it matters in pregnancy. Repair has nucleoli and no molding."
    },
    "cyto-leptothrix": {
      name: "Leptothrix (long filaments)",
      scientific: "Leptothrix",
      about: "A long, thin, segmented filament that likes to travel with Trichomonas. The name means 'fine hair.' It is not treated as a pathogen on its own. The useful move is to look harder for trich once you see it, and not to call it Candida just because something is long and pink."
    },
    "cyto-cornflake": {
      name: "Cornflake artifact (air-drying)",
      scientific: "Cornflake artifact",
      about: "A coverslipping classic: air trapped or the mountant dried on a superficial cell, leaving a brown crunchy plaque. Generations of cytotechs have been warned not to call it pigment, fungus, or keratin. It is a prep problem. The cell under it is usually innocent."
    },
    "cyto-pollen": {
      name: "Pollen (airborne contaminant)",
      scientific: "Pollen grain",
      about: "Spring in the lab. Pollen has a thick geometric wall and no nucleus, which is how you refuse Trichomonas and koilocytes. Starch from glove powder is the other plant-like guest. Neither belongs to the patient. Note it if you must; do not put it in the interpretation line."
    }
  };

  const ALIASES = {
    "Babesia microti": "Babesiosis (Maltese-cross rings)",
    "Howell–Jolly bodies": "Howell–Jolly bodies (DNA leftovers in red cells)",
    "Platelets overlying RBCs": "Platelets on red cells (not parasites)",
    "Microfilaria fragment": "Filariasis (broken worm)",
    "Trypanosoma cruzi": "Chagas disease (kissing-bug parasite)",
    "Plasmodium vivax gametocyte": "Malaria (vivax sex cell)",
    "Plasmodium ovale": "Malaria (ovale)",
    "Plasmodium falciparum rings": "Malaria (falciparum rings)",
    "Plasmodium falciparum": "Malaria (falciparum)",
    "Plasmodium knowlesi": "Malaria (knowlesi)",
    "Bartonella bacilliformis": "Oroya fever (Bartonella on red cells)",
    "Trypanosoma brucei": "Sleeping sickness (African trypanosome)",
    "Borrelia recurrentis": "Relapsing fever (louse-borne spirochete)",
    Microfilaria: "Filariasis (worm in blood)",
    "Borrelia spp.": "Relapsing fever (spirochetes)",
    "Histoplasma capsulatum": "Histoplasmosis (tiny intracellular yeast)",
    "Toxoplasma gondii": "Toxoplasmosis (crescent parasites)",
    "Trypanosoma cruzi amastigotes": "Chagas disease (amastigotes)",
    "Trichomonas vaginalis": "Trichomoniasis (flagellate)",
    "Chilomastix mesnili": "Chilomastix (harmless gut flagellate)",
    "Dientamoeba fragilis": "Dientamoeba (gut flagellate)",
    "Entamoeba coli": "Non-pathogenic ameba (Entamoeba coli)",
    "Macrophage in stool": "Macrophage in stool (not an ameba)",
    "Iodamoeba bütschlii": "Iodamoeba (harmless gut ameba)",
    "Cyclospora cayetanensis": "Cyclosporiasis (larger acid-fast egg)",
    "Cystoisospora belli": "Cystoisosporiasis (largest acid-fast egg)",
    "Yeast in stool": "Yeast in stool (not a parasite egg)",
    "Leishmania amastigotes": "Leishmaniasis (amastigotes)",
    "Schistosoma mansoni egg": "Schistosomiasis (egg with a side spine)",
    "Schistosoma japonicum egg": "Schistosomiasis (rounded egg)",
    "Hookworm egg": "Hookworm (thin-shelled egg)",
    "Trichuris trichiura egg": "Whipworm (barrel-shaped egg)",
    "Taenia egg": "Tapeworm (striated egg)",
    "Enterobius vermicularis egg": "Pinworm (D-shaped egg)",
    "Capillaria philippinensis egg": "Capillariasis (striated egg)",
    "Strongyloides egg": "Threadworm (egg, uncommon in stool)",
    "Ascaris (decorticated)": "Roundworm (egg without its coat)",
    "Trichostrongylus egg": "Trichostrongylus (lookalike hookworm egg)",
    "Pollen grain": "Pollen (not an egg)",
    "Hookworm rhabditiform larva": "Hookworm (gut larva)",
    "Enterobius adult fragment": "Pinworm (adult fragment)",
    "Free-living nematode": "Free-living worm (not Strongyloides)",
    "Sarcocystis in muscle": "Sarcocystosis (cyst in muscle)",
    "Toxoplasma tissue cyst": "Toxoplasmosis (tissue cyst)",
    "Artifact / folded fiber": "Folded fiber (not a worm)",
    "Hymenolepis nana egg": "Dwarf tapeworm (egg with filaments)",
    "Ascaris lumbricoides egg": "Roundworm (thick-shelled egg)",
    "Cotton fiber artifact": "Cotton fiber (not a worm)",
    "Nocardia (partially acid-fast)": "Nocardia (partially acid-fast rods)",
    "Mycobacterium avium complex": "MAC (atypical mycobacteria)",
    "Artifact / stain precipitate": "Stain precipitate (not a bug)",
    "Viridans streptococci": "Viridans strep (mouth chains)",
    Enterococcus: "Enterococcus (gut cocci in pairs)",
    "Listeria monocytogenes": "Listeriosis (rods in pairs)",
    "Coagulase-negative staphylococci": "Coag-neg staph (skin clusters)",
    Micrococcus: "Micrococcus (tetrads)",
    Peptostreptococcus: "Peptostreptococcus (anaerobic cocci)",
    "Neisseria meningitidis": "Meningococcus (kidney-bean diplococci)",
    "Moraxella catarrhalis": "Moraxella (kidney-bean diplococci)",
    Acinetobacter: "Acinetobacter (plump Gram-negative rods)",
    "Clostridium botulinum": "Botulism (spore-forming rods)",
    "Clostridioides difficile": "C. diff (spore-forming rods)",
    "Bacillus spp.": "Bacillus (boxcar rods)",
    Campylobacter: "Campylobacter (gull-wing rods)",
    "Contaminating oral flora": "Oral flora (not H. pylori)",
    "Mucus strands": "Mucus strands (not bacteria)",
    "Aspergillus hyphae": "Aspergillosis (45-degree mold)",
    Trichosporon: "Trichosporon (yeast with arthroconidia)",
    "Artifact / fiber": "Fiber (not a fungus)",
    Fusarium: "Fusarium (lookalike mold)",
    Mucorales: "Mucormycosis (ribbon mold)",
    "Candida hyphae": "Candidiasis (yeast hyphae)",
    "Candida in CSF": "Candidiasis (yeast in CSF)",
    "Artifact in India ink": "India-ink artifact (not a capsule)",
    "Blastomyces dermatitidis": "Blastomycosis (broad-based budding)",
    "Cryptococcus neoformans": "Cryptococcosis (capsule yeast)",
    "Coccidioides endospores": "Valley fever (loose endospores)",
    "Paracoccidioides brasiliensis": "Paracoccidioidomycosis (pilot-wheel yeast)",
    "Rhinosporidium seeberi": "Rhinosporidiosis (huge spherules)",
    "Empty spherule artifact": "Empty spherule (artifact)",
    "Candida glabrata": "Candidiasis (small budding yeast)",
    "Stain precipitate": "Stain precipitate (not a cyst)",
    "HSV / VZV inclusions": "Herpes (HSV / VZV inclusions)",
    "Reactive pneumocyte atypia": "Reactive lung cell (not CMV)",
    "Adenovirus smudge cells": "Adenovirus (smudge cells)",
    "Cryptococcus (capsule-deficient)": "Cryptococcosis (capsule-deficient yeast)",
    "Hemoglobin SC disease": "Hemoglobin SC (fat boats and targets)",
    "Bite cells / oxidant injury": "G6PD deficiency (bite cells)",
    "Artifact from old smear": "Old-smear artifact (pointed red cells)",
    "Acute lymphoblastic leukemia": "Leukemia (ALL)",
    "Reactive left shift": "Infection (left shift)",
    "CML blast crisis": "Leukemia (CML blast crisis)",
    "Mantle cell leukemia": "Mantle cell (leukemic phase)",
    "Follicular lymphoma in blood": "Follicular lymphoma (in blood)",
    "Reactive lymphocytosis": "Infection (reactive lymphocytes)",
    "Leukemoid reaction": "Infection (leukemoid reaction)",
    CMML: "CMML (chronic myelomonocytic leukemia)",
    "Polycythemia vera with left shift": "Polycythemia (left shift)",
    "Band neutrophil": "Band neutrophil (young neutrophil)",
    Monocyte: "Monocyte (macrophage precursor)",
    "Pelger–Huët cell": "Pelger–Huët (bilobed neutrophil)",
    "Neutrophil with toxic granules": "Infection (toxic neutrophil)",
    Basophil: "Basophil (rarest white cell)",
    "Mast cell": "Mast cell (tissue allergy cell)",
    "Dirty neutrophil": "Dirty neutrophil (overstained)",
    "Overstained lymphocyte": "Overstained lymphocyte (not a basophil)",
    Osteoclast: "Osteoclast (bone-eating cell)",
    "Reed–Sternberg cell": "Hodgkin lymphoma (Reed–Sternberg cell)",
    "Multinucleated histiocyte": "Giant cell (fused macrophages)",
    "Microspherocytes of burns": "Burns (tiny spherocytes)",
    "Overstained normal RBCs": "Overstained red cells (not spherocytes)",
    "Liver-disease cells": "Liver disease (thin red cells)",
    "Sickle cell disease": "Sickle cell disease (pointed red cells)",
    "Artifact from slow drying": "Slow-dry artifact (false targets)",
    "Hemoglobin C crystals": "Hemoglobin C (crystal-shaped red cells)",
    "ALL blast": "Leukemia (ALL blast)",
    "Reactive myelocyte": "Infection (reactive myelocyte)",
    "Stain crystal": "Stain crystal (not an Auer rod)",
    Megakaryocyte: "Megakaryocyte (platelet factory)",
    "Viral immunoblast": "Viral immunoblast (activated lymphocyte)",
    "Anaplastic large-cell lymphoma": "ALCL (anaplastic large-cell lymphoma)",
    "Ciliated tuft (ciliocytophthoria)": "Ciliocytophthoria (shed cilia)",
    "Fiber artifact": "Fiber (not a sperm)",
    "Lafora bodies": "Lafora bodies (not ground-glass)",
    "Oncocytic change": "Oncocytic change (mitochondrial swell)",
    "Glycogenated nuclei only": "Glycogenated nuclei (not ground-glass)",
    "Sebaceous gland": "Sebaceous gland (oily skin gland)",
    Xanthoma: "Xanthoma (foamy fat-filled cells)",
    "Liposarcoma / atypical lipoma": "Liposarcoma (malignant fat)",
    Emphysema: "Emphysema (destroyed air sacs)",
    "Thyroid follicles": "Thyroid (colloid follicles)",
    "Adipose tissue": "Fat (adipose tissue)",
    "Skeletal muscle": "Skeletal muscle (voluntary muscle)",
    "Smooth muscle": "Smooth muscle (involuntary muscle)",
    Nerve: "Nerve (axons and myelin)",
    Cementum: "Cementum (tooth-root bone)",
    Dentin: "Dentin (tooth ivory)",
    "Pagetoid bone": "Paget disease (disordered bone)",
    "Squamous mucosa": "Squamous mucosa (moist lining)",
    Urothelium: "Bladder lining (umbrella cells)",
    "Stratified squamous papilloma": "Squamous papilloma (warty growth)",
    "Islet of Langerhans": "Pancreas (islet of Langerhans)",
    "Nerve fascicle": "Nerve fascicle (bundled axons)",
    "Capillary hemangioma": "Hemangioma (tangled capillaries)",
    "Signet-ring carcinoma": "Signet-ring cancer (malignant mucus cell)",
    "Paneth cells": "Paneth cell (crypt enzyme cell)",
    "Mast cells": "Mast cell (tissue allergy cell)",
    "Elastic cartilage": "Elastic cartilage (ear cartilage)",
    Fibrocartilage: "Fibrocartilage (disc cartilage)",
    Chondrosarcoma: "Chondrosarcoma (cartilage cancer)",
    "Betz cell (motor cortex)": "Betz cell (motor-cortex neuron)",
    "Anterior horn neuron": "Anterior horn cell (spinal motor neuron)",
    "Reactive astrocyte": "Reactive astrocyte (scar glia)",
    "Cardiac muscle": "Heart muscle (cardiac)",
    Alveoli: "Lung (air sacs)",
    "Colloid goiter vs normal": "Goiter (overfilled thyroid)",
    Parathyroid: "Parathyroid (not thyroid)",
    Glomerulus: "Kidney filter (glomerulus)",
    "Islet-cell tumor": "Islet-cell tumor (pancreatic NET)",
    "Lymphoid aggregate": "Lymphoid aggregate (not an islet)",
    "Fallopian tube epithelium": "Fallopian tube (ciliated lining)",
    "Vas deferens": "Vas deferens (sperm duct)",
    "Intestinal epithelium": "Gut lining (absorptive epithelium)",
    "Plasmodium vivax": "Malaria (vivax)",
    "Plasmodium malariae": "Malaria (malariae / band forms)",
    "Giardia lamblia": "Giardiasis (owl-face parasite)",
    Spermatozoa: "Sperm (male gamete)",
    Ciliocytophthoria: "Ciliocytophthoria (shed cilia)",
    "Cryptosporidium oocysts": "Cryptosporidiosis (tiny acid-fast eggs)",
    "Wuchereria bancrofti": "Lymphatic filariasis (Wuchereria)",
    "Mansonella perstans": "Mansonella (unsheathed blood worm)",
    "Trichinella spiralis": "Trichinellosis (coiled worm in muscle)",
    "Nucleated RBC": "Nucleated red cell (young red cell)",
    "CLL cell": "Leukemia (CLL)",
    "Reactive lymphocyte": "Infection (reactive lymphocyte)",
    Promyelocyte: "Promyelocyte (early neutrophil)",
    "Hairy cell": "Hairy-cell leukemia (frayed lymphocyte)",
    "Acute myeloid leukemia": "Leukemia (AML)",
    "CLL / SLL": "Leukemia (CLL / SLL)",
    "Normal neutrophil": "Neutrophil (most common white cell)",
    "Steroid-induced granulocytosis": "Steroids (extra neutrophils)",
    Agglutination: "Cold agglutinin (clumped red cells)",
    "Normal stacked smear edge": "Smear edge (normal stacking)",
    "Cold agglutinin disease": "Cold agglutinin disease (clumped red cells)",
    "Bite cells": "G6PD deficiency (bite cells)",
    "Fragmented smear artifact": "Smear artifact (broken red cells)",
    "Sickle cells": "Sickle cell disease (pointed red cells)",
    "Streptococcus pneumoniae": "Pneumonia (lancet-shaped diplococci)",
    Corynebacterium: "Diphtheroid (club-shaped rods)",
    Bordetella: "Whooping cough (Bordetella)",
    Pasteurella: "Pasteurella (bipolar rods)",
    Aspergillus: "Aspergillosis (45-degree mold)",
    "Spiral artifact": "Spiral artifact (not a spirochete)",
    "Artifact / empty vessel": "Empty vessel (not a hypha)",
    "Dense fibroconnective tissue": "Dense fibrous tissue (collagen)",
    Spleen: "Spleen (blood filter)",
    Tonsil: "Tonsil (crypts and squamous surface)",
    Thymus: "Thymus (T-cell school)",
    "Lymph node": "Lymph node (immune filter)",
    "Fat necrosis": "Fat necrosis (dead fat)",
    "Cerebral cortex": "Cerebral cortex (thinking brain)",
    Retina: "Retina (layered eye lining)",
    "Adrenal cortex": "Adrenal cortex (steroid layers)",
    Astrocyte: "Astrocyte (brain support cell)",
    "Ganglion cell in other sites": "Ganglion cell (peripheral neuron)",
    "Reactive histiocyte": "Histiocyte (cleanup macrophage)",
    Oligodendrocyte: "Oligodendrocyte (myelin cell)",
    Neuron: "Neuron (nerve cell)",
    "Reactive fibroblast": "Fibroblast (scar cell)",
    "Multinucleated giant cell": "Giant cell (fused macrophages)",
    "Tumor giant cell": "Tumor giant cell (malignant)",
    "Seminal vesicle": "Seminal vesicle (golden pigment glands)",
    "Breast glands": "Breast (glands)",
    "Hyperplastic prostate vs carcinoma": "BPH (enlarged prostate glands)",
    "Hemorrhagic lymph node": "Bloody lymph node (not spleen)",
    "Squamous epithelium": "Squamous lining (flat stacked cells)",
    Endometrium: "Endometrium (uterine lining)",
    "Urothelial carcinoma in situ": "Bladder CIS (flat cancer)"
  };

  window.SPECIMENS.forEach((item) => {
    const call = CALLS[item.id];
    if (call) {
      item.scientific = call.scientific;
      item.name = call.name;
      if (call.about) item.about = call.about;
      if (call.chart) item.chart = call.chart;
    } else {
      item.scientific = item.name;
    }
    item.lookalikes = item.lookalikes.map((label) => ALIASES[label] || label);
  });
})();
