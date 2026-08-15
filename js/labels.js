(function () {
  const CALLS = {
    "pf-rings": {
      name: "Malaria (falciparum rings)",
      scientific: "Plasmodium falciparum ring trophozoites",
    },
    "pf-gam": {
      name: "Malaria (falciparum crescents)",
      scientific: "Plasmodium falciparum gametocytes",
    },
    "p-vivax": {
      name: "Malaria (vivax)",
      scientific: "Plasmodium vivax",
    },
    "p-malariae": {
      name: "Malaria (malariae / band forms)",
      scientific: "Plasmodium malariae",
    },
    "p-ovale": {
      name: "Malaria (ovale)",
      scientific: "Plasmodium ovale",
    },
    babesia: {
      name: "Babesiosis (Maltese-cross rings)",
      scientific: "Babesia microti",
    },
    "t-cruzi": {
      name: "Chagas disease (kissing-bug parasite)",
      scientific: "Trypanosoma cruzi",
    },
    "t-brucei": {
      name: "Sleeping sickness (African trypanosome)",
      scientific: "Trypanosoma brucei",
    },
    leishmania: {
      name: "Leishmaniasis (amastigotes)",
      scientific: "Leishmania donovani amastigotes",
    },
    giardia: {
      name: "Giardiasis (owl-face parasite)",
      scientific: "Giardia lamblia (G. intestinalis / G. duodenalis)",
    },
    "e-histolytica": {
      name: "Amebiasis (ameba eating red cells)",
      scientific: "Entamoeba histolytica trophozoite",
    },
    cryptosporidium: {
      name: "Cryptosporidiosis (tiny acid-fast eggs)",
      scientific: "Cryptosporidium oocysts",
    },
    toxoplasma: {
      name: "Toxoplasmosis (crescent parasites)",
      scientific: "Toxoplasma gondii tachyzoites",
    },
    "s-haematobium": {
      name: "Schistosomiasis (egg with a terminal spine)",
      scientific: "Schistosoma haematobium egg",
    },
    ascaris: {
      name: "Roundworm (thick-shelled egg)",
      scientific: "Ascaris lumbricoides egg",
    },
    trichuris: {
      name: "Whipworm (barrel-shaped egg)",
      scientific: "Trichuris trichiura egg",
    },
    hookworm: {
      name: "Hookworm (thin-shelled egg)",
      scientific: "Necator americanus / Ancylostoma duodenale egg",
    },
    pinworm: {
      name: "Pinworm (D-shaped egg)",
      scientific: "Enterobius vermicularis egg",
    },
    strongyloides: {
      name: "Threadworm (gut larva)",
      scientific: "Strongyloides stercoralis rhabditiform larva",
    },
    trichinella: {
      name: "Trichinellosis (coiled worm in muscle)",
      scientific: "Trichinella spiralis",
    },
    taenia: {
      name: "Tapeworm (striated egg)",
      scientific: "Taenia species egg",
    },
    microfilaria: {
      name: "Filariasis (worm in blood)",
      scientific: "Microfilaria",
    },
    trichomonas: {
      name: "Trichomoniasis (flagellate)",
      scientific: "Trichomonas vaginalis",
    },
    cyclospora: {
      name: "Cyclosporiasis (larger acid-fast egg)",
      scientific: "Cyclospora cayetanensis",
    },
    "loa-loa": {
      name: "Loiasis (eye worm in blood)",
      scientific: "Loa loa",
    },
    sarcocystis: {
      name: "Sarcocystosis (cyst in muscle)",
      scientific: "Sarcocystis",
    },
    tb: {
      name: "Tuberculosis (acid-fast rods)",
      scientific: "Mycobacterium tuberculosis",
    },
    "s-pneumoniae": {
      name: "Pneumonia (lancet-shaped diplococci)",
      scientific: "Streptococcus pneumoniae",
    },
    "s-aureus": {
      name: "Staph infection (grape-cluster cocci)",
      scientific: "Staphylococcus aureus",
    },
    "n-gonorrhoeae": {
      name: "Gonorrhea (kidney-bean diplococci)",
      scientific: "Neisseria gonorrhoeae",
    },
    "c-tetani": {
      name: "Tetanus (drumstick rods)",
      scientific: "Clostridium tetani",
    },
    "h-pylori": {
      name: "Stomach ulcer bug (corkscrew rods)",
      scientific: "Helicobacter pylori",
    },
    candida: {
      name: "Candidiasis (yeast with pseudohyphae)",
      scientific: "Candida albicans",
    },
    aspergillus: {
      name: "Aspergillosis (45-degree mold)",
      scientific: "Aspergillus fumigatus",
    },
    "c-neoformans": {
      name: "Cryptococcosis (capsule yeast)",
      scientific: "Cryptococcus neoformans",
    },
    blastomyces: {
      name: "Blastomycosis (broad-based budding)",
      scientific: "Blastomyces dermatitidis",
    },
    coccidioides: {
      name: "Valley fever (spherules)",
      scientific: "Coccidioides immitis / C. posadasii",
    },
    pneumocystis: {
      name: "PCP (cup-shaped cysts)",
      scientific: "Pneumocystis jirovecii",
    },
    cmv: {
      name: "CMV (owl-eye cell)",
      scientific: "Cytomegalovirus inclusions",
    },
    histoplasma: {
      name: "Histoplasmosis (tiny intracellular yeast)",
      scientific: "Histoplasma capsulatum",
    },
    listeria: {
      name: "Listeriosis (rods in pairs)",
      scientific: "Listeria monocytogenes",
    },
    "h-influenzae": {
      name: "Haemophilus (tiny Gram-negative rods)",
      scientific: "Haemophilus influenzae",
    },
    borrelia: {
      name: "Relapsing fever (spirochetes)",
      scientific: "Borrelia",
    },
    mucor: {
      name: "Mucormycosis (ribbon mold)",
      scientific: "Mucorales",
    },
    sickle: {
      name: "Sickle cell disease (pointed red cells)",
      scientific: "Drepanocytes",
    },
    aml: {
      name: "Leukemia (AML)",
      scientific: "Acute myeloid leukemia",
    },
    cll: {
      name: "Leukemia (CLL)",
      scientific: "Chronic lymphocytic leukemia",
    },
    cml: {
      name: "Leukemia (CML)",
      scientific: "Chronic myeloid leukemia",
    },
    all: {
      name: "Leukemia (ALL)",
      scientific: "Acute lymphoblastic leukemia",
    },
    spherocytes: {
      name: "Spherocytosis (sphere-shaped red cells)",
      scientific: "Spherocytes",
    },
    "target-cells": {
      name: "Target cells (bull's-eye red cells)",
      scientific: "Codocytes",
    },
    "auer-rod": {
      name: "Leukemia (AML with Auer rod)",
      scientific: "Myeloblast with Auer rod",
    },
    "reed-sternberg": {
      name: "Hodgkin lymphoma (Reed–Sternberg cell)",
      scientific: "Reed–Sternberg cell",
    },
    hepatocytes: {
      name: "Hepatitis B (ground-glass liver cells)",
      scientific: "Ground-glass hepatocytes",
    },
    hyperseg: {
      name: "B12 / folate deficiency (hypersegmented neutrophil)",
      scientific: "Hypersegmented neutrophil",
    },
    rouleaux: {
      name: "Paraprotein (stacked red cells)",
      scientific: "Rouleaux",
    },
    schistocytes: {
      name: "TTP (broken red cells)",
      scientific: "Schistocytes (microangiopathic hemolysis)",
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
