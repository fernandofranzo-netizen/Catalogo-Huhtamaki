import fs from 'fs';
import { CatalogItem } from '../src/types';

const rawData = `UNIFORMES	UN-CALCA-00001-00	CALCA PROFIS SOLASOL AZ MAR UNI TRAD 38		 	 
UNIFORMES	UN-CALCA-00002-00	CALCA PROFIS SOLASOL AZ MAR UNI TRAD 40		 	 
UNIFORMES	UN-CALCA-00003-00	CALCA PROFIS SOLASOL AZ MAR UNI TRAD 42		 	 
UNIFORMES	UN-CALCA-00004-00	CALCA PROFIS SOLASOL AZ MAR UNI TRAD 44		 	 
UNIFORMES	UN-CALCA-00005-00	CALCA PROFIS SOLASOL AZ MAR UNI TRAD 46		 	 
UNIFORMES	UN-CALCA-00006-00	CALCA PROFIS SOLASOL AZ MAR UNI TRAD 48		 	 
UNIFORMES	UN-CALCA-00007-00	CALCA SEG 88PCT ALGOD/12PCT NY CZ M		 	 
UNIFORMES	UN-CALCA-00008-00	CALCA SEG 88PCT ALGOD/12PCT NY CZ G		 	 
UNIFORMES	UN-CALCA-00009-00	CALCA SEG 88PCT ALGOD/12PCT NY CZ P		 	 
UNIFORMES	UN-CALCA-00010-00	CALCA BRIM UNISEX COR AZUL BIC COS ELASTT TAM PP	2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00011-00	CALCA BRIM UNISEX COR AZUL BIC COS ELASTT TAM P	2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00012-00	CALCA BRIM UNISEX COR AZUL BIC COS ELASTT TAM M	2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00013-00	CALCA BRIM UNISEX COR AZUL BIC COS ELASTT TAM G	2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00014-00	CALCA BRIM UNISEX COR AZUL BIC COS ELASTT TAM GG	2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00015-00	CALCA BRIM UNISEX COR CINZA COS ELAST TT TAM PP	BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA PERNA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00016-00	CALCA BRIM UNISEX COR CINZA COS ELAST TT TAM P	BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA PERNA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00017-00	CALCA BRIM UNISEX COR CINZA COS ELAST TT TAM M	BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA PERNA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00018-00	CALCA BRIM UNISEX COR CINZA COS ELAST TT TAM G	BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA PERNA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00019-00	CALCA BRIM UNISEX COR CINZA COS ELAST TT TAM GG	BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA PERNA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00020-00	CALCA BRIM UNISEX COR AZUL ESCURO COS ELATT TAM PP	 2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00021-00	CALCA BRIM UNISEX COR AZUL ESCURO COS ELATT TAM P	 2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00022-00	CALCA BRIM UNISEX COR AZUL ESCURO COS ELATT TAM M	 2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00023-00	CALCA BRIM UNISEX COR AZUL ESCURO COS ELATT TAM G	 2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00024-00	CALCA BRIM UNISEX COR AZUL ESCURO COS ELATT TAM GG	 2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00025-00	CALCA SEG UNIPARSANT 237GRS AZUL ROYAL FAIXA REFLT	JOELHO ELETRICA TAM P	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00026-00	CALCA SEG UNIPARSANT 237GRS AZUL ROYAL FAIXA REFLT	JOELHO ELETRICA TAM M	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00027-00	CALCA SEG UNIPARSANT 237GRS AZUL ROYAL FAIXA REFLT	JOELHO ELETRICA TAM G	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00028-00	CALCA SEG UNIPARSANT 237GRS AZUL ROYAL FAIXA REFLT	JOELHO ELETRICA TAM GG	 	 
UNIFORMES	UN-CALCA-00029-00	CALCA SEG UNIPARSANT 237GRS AZUL CLARO TAM P		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00030-00	CALCA SEG UNIPARSAT 237GRS AZUL CLARO TAM M		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00031-00	CALCA SEG UNIPARSANT 237GRS AZUL CLARO TAM G FX RE		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00032-00	CALCA SEG UNIPARSANT 237GRS AZUL CLARO FAIXA REFLT	JOELHO ELETRICA TAM GG	 	 
UNIFORMES	UN-CALCA-00033-00	CALCA SEG UNIPARSANT 237GRS AZUL ESCUR TAM P		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00034-00	CALCA SEG UNIPARSANT 237GRS AZUL ESCUR TAM M		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00035-00	CALCA SEG UNIPARSANT 237GRS AZUL ESCUR TAM G		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00036-00	CALCA SEG UNIPARSANT 237GRS AZUL ESCUR FAIXA REFLT	JOELHO ELETRICA TAM GG	 	 
UNIFORMES	UN-CALCA-00037-00	CALCA SEG UNIPARSANT 237GRS CINZA TOTAL FX TAM P		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00038-00	CALCA SEG UNIPARSANT 237GRS CINZA TOTAL FX TAM M		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00039-00	CALCA SEG UNIPARSANT 237GRS CINZA TOTAL FX TAM G		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00040-00	CALCA SEG UNIPARSANT 237GRS CINZA TOTAL FX REFLTV	CALCANHAR ELETRICISTA TAM GG	 	 
UNIFORMES	UN-CALCA-00041-00	CALCA SEG UNIPARSANT 237GRS CINZA COM FX AZ CLARO	JOELHO FX REFTV CALCANHR ELETRICISTA TAM P	 	 
UNIFORMES	UN-CALCA-00042-00	CALCA SEG UNIPARSANT 237GRS CINZA COM FX AZ CLARO	JOELHO FX REFTV CALCANHR ELETRICISTA TAM M	 	 
UNIFORMES	UN-CALCA-00043-00	CALCA SEG UNIPARSANT 237GRS CINZA COM FX AZ CLARO	JOELHO FX REFTV CALCANHR ELETRICISTA TAM G	 	 
UNIFORMES	UN-CALCA-00044-00	CALCA SEG UNIPARSANT 237GRS CINZA COM FX AZ CLARO	JOELHO FX REFTV CALCANHR ELETRICISTA TAM GG	 	 
UNIFORMES	UN-CALCA-00045-00	CALCA SEG UNIPARSANT 237GRS CINZA COM FX AZ ESCURO	JOELHO FX REFTV CALCANHR ELETRICISTA TAM P	 	 
UNIFORMES	UN-CALCA-00046-00	CALCA SEG UNIPARSANT 237GRS CINZA COM FX AZ ESCURO	JOELHO FX REFTV CALCANHR ELETRICISTA TAM M	 	 
UNIFORMES	UN-CALCA-00047-00	CALCA SEG UNIPARSANT 237GRS CINZA COM FX AZ ESCURO	JOELHO FX REFTV CALCANHR ELETRICISTA TAM G	 	 
UNIFORMES	UN-CALCA-00048-00	CALCA SEG UNIPARSANT 237GRS CINZA COM FX AZ ESCURO	JOELHO FX REFTV CALCANHR ELETRICISTA TAM GG	 	 
UNIFORMES	UN-CALCA-00049-00	CALCA SEG UNIPARSANTE 237GRS PRO FR AZ ESC TM G		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00050-00	CALCA AZ MARINHO BRIM PESADO TAM P		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00051-00	CALCA AZ MARINHO BRIM PESADO TAM M		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00052-00	CALCA AZ MARINHO BRIM PESADO TAM G		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00053-00	CALCA AZ MARINHO BRIM PESADO TAM GG		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00054-00	CALCA AZ MARINHO BRIM PESADO FX AZ CL TAM P		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00055-00	CALCA AZ MARINHO BRIM PESADO FX AZ CL TAM M		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00056-00	CALCA AZ MARINHO BRIM PESADO FX AZ CL TAM G		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00057-00	CALCA AZ MARINHO BRIM PESADO FX AZ CL TAM GG		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00058-00	CALCA AZ MARINHO BRIM PESADO FX CZ CL TAM P		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00059-00	CALCA AZ MARINHO BRIM PESADO FX CZ CL TAM M		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00060-00	CALCA AZ MARINHO BRIM PESADO FX CZ CL TAM G		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00061-00	CALCA AZ MARINHO BRIM PESADO FX CZ CL TAM GG		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CALCA-00062-00	CALCA CINZA FX REFLE C.A 45168/49122/37839 TM P		 	 
UNIFORMES	UN-CALCA-00063-00	CALCA CINZA FX REFLE C.A 45168/49122/41136 TM M		Workwear                                          	Workwear                                                         
UNIFORMES	UN-CALCA-00064-00	CALCA CINZA FX REFLE C.A 45168/49122/41136 TM G		Workwear                                          	Workwear                                                         
UNIFORMES	UN-CALCA-00065-00	CALCA CINZA FX REFLE C.A 45168/49122/41136 TM GG		Workwear                                          	Workwear                                                         
UNIFORMES	UN-CALCA-00066-00	CALCA CINZ FX REFL COM FAIXA AZUL CLARO TAMANHO P		 	 
UNIFORMES	UN-CALCA-00067-00	CALCA CINZ FX REFL COM FAIXA AZUL CLARO TAMANHO M		Workwear                                          	Workwear                                                         
UNIFORMES	UN-CALCA-00068-00	CALCA CINZ FX REFL COM FAIXA AZUL CLARO TAMANHO G		Workwear                                          	Workwear                                                         
UNIFORMES	UN-CALCA-00069-00	CALCA CINZ FX REFL COM FAIXA AZUL CLARO TAMANHO GG		Workwear                                          	Workwear                                                         
UNIFORMES	UN-CALCA-00070-00	CALCA CINZA FX REFL COM FAIXA AZUL ESCURO TM P		 	 
UNIFORMES	UN-CALCA-00071-00	CALCA CINZA FX REFL COM FAIXA AZUL ESCURO TM M		Workwear                                          	Workwear                                                         
UNIFORMES	UN-CALCA-00072-00	CALCA CINZA FX REFL COM FAIXA AZUL ESCURO TM G		Workwear                                          	Workwear                                                         
UNIFORMES	UN-CALCA-00073-00	CALCA CINZA FX REFL COM FAIXA AZUL ESCURO TM GG		Workwear                                          	Workwear                                                         
UNIFORMES	UN-CAMIS-00001-00	CAMISA AZUL MARINHO POLIVISCOSE POLO MASCULINA \"G\"		 	 
UNIFORMES	UN-CAMIS-00002-00	CAMISA AZUL MARINHO POLIVISCOSE POLO MASCULINA \"GG		 	 
UNIFORMES	UN-CAMIS-00003-00	CAMISETA MASC POLO 3 BOT AZ MAR M C/LOGO		 	 
UNIFORMES	UN-CAMIS-00004-00	CAMISETA MASC 50PCT ALG/50PCT PES VM G		 	 
UNIFORMES	UN-CAMIS-00005-00	CAMISETA MASC 50PCT ALG/50PCT PES VM GG		 	 
UNIFORMES	UN-CAMIS-00006-00	CAMISETA MASC 50PCT ALG/50PCT PES VM M		 	 
UNIFORMES	UN-CAMIS-00007-00	CAMISA POLO MALHA PIQUET CINZA P/EMPILHADOR \"M\"		 	 
UNIFORMES	UN-CAMIS-00008-00	CAMISA POLO MALHA PIQUET CINZA P/EMPILHADOR \"G\"		 	 
UNIFORMES	UN-CAMIS-00009-00	CAMISA POLO MALHA PIQUET CINZA P/EMPILHADOR \"GG\"		 	 
UNIFORMES	UN-CAMIS-00010-00	CAMISA SEGURANCA MANGA LONGA INDURA ULTRA SOFT STY		 	 
UNIFORMES	UN-CAMIS-000102-00	CAMIS SOCIAL SLIM MASC MANGA CURTA AZUL CL TAM 4	CAMISETA SOCIAL SLIM MASC DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00011-00	CAMISA SEGURANCA MANGA LONGA INDURA ULTRA SOFT STY		 	 
UNIFORMES	UN-CAMIS-00012-00	CAMISA SEGURANCA MANGA LONGA RETARDANTE CHAMAS MEC		 	 
UNIFORMES	UN-CAMIS-00013-00	CAMISA SEGURANCA MANGA LONGA RETARDANTE CHAMAS MEC		 	 
UNIFORMES	UN-CAMIS-00014-00	CAMISA MANGA LONGA AZUL 4 BOLSOS FIT REFLET TORAX		 	 
UNIFORMES	UN-CAMIS-00015-00	CAMISA MANGA CURTA AZUL 4 BOLSOS REFL NO TORAX TAM		 	 
UNIFORMES	UN-CAMIS-00016-00	CAMISA MANGA LONGA AZUL 4 BOLSOSREFL NO TORAX TAM		 	 
UNIFORMES	UN-CAMIS-00017-00	CAMISA MANGA CURTA AZUL 4 BOLSOS REFL NO TORAX TAM		 	 
UNIFORMES	UN-CAMIS-00018-00	CAMISA MANGA CURTA AZUL 4 BOLSOS REFL NO TORAX TAM		 	 
UNIFORMES	UN-CAMIS-00019-00	CAMISA MANGA LONGA AZUL 4 BOLSOS REFL NO TORAX TAM		 	 
UNIFORMES	UN-CAMIS-00020-00	CAMISETA MASC POLO CT AZ MAR G C/LOGO		 	 
UNIFORMES	UN-CAMIS-00021-00	CAMISETA MASC POLO CT AZ MAR M C/LOGO		 	 
UNIFORMES	UN-CAMIS-00022-00	CAMISETA MASC POLO CT MALH PIQ AZ ESC P		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00023-00	CAMISETA MASC POLO CT MALH PIQ AZ ESC M		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00024-00	CAMISETA MASC POLO CT MALH PIQ AZ ESC GG		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00025-00	CAMISETA MASC POLO CT MALH PIQ AZ ESC XG		 	 
UNIFORMES	UN-CAMIS-00026-00	CAMISETA MASC POLO MALH PIQ CZ M C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00027-00	CAMISETA MASC POLO CT MALH PIQ AZ CL M		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00028-00	CAMISETA MASC POLO CT MALH PIQ AZ CL G		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00029-00	CAMISETA MASC POLO CT MALH PIQ AZ CL GG		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00030-00	CAMISETA MASC POLO CT MALH PIQ AZ CL XG		 	 
UNIFORMES	UN-CAMIS-00031-00	CAMISETA FEM POLO CT MALH PIQ AZ ESC PP		 	 
UNIFORMES	UN-CAMIS-00032-00	CAMISETA FEM POLO CT MALH PIQ AZ ESC P		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00033-00	CAMISETA FEM POLO CT MALH PIQ AZ ESC M		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00034-00	CAMISETA FEM POLO MALH PIQ CZ M C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00035-00	CAMISETA FEM POLO CT MALH PIQ AZ CL PP		 	 
UNIFORMES	UN-CAMIS-00036-00	CAMISETA FEM POLO 3 BOT MALH PIQ AZ CL P		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00037-00	CAMISETA FEM POLO 3 BOT MALH PIQ AZ CL M		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00038-00	CAMISETA MASC POLO MALH PIQ VM M C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00039-00	CAMISETA MASC POLO MALH PIQ VN G C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00040-00	CAMISETA MASC POLO CT MALH PIQ VM/VN GG		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00041-00	CAMISETA FEM POLO 3 BOT MALH PIQ VM/VN P		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00042-00	CAMISETA FEM POLO MALH PIQ VM PP C/LOGO		 	 
UNIFORMES	UN-CAMIS-00043-00	CAMISETA FEM POLO MALH PIQ VM M C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00044-00	CAMISETA MASC POLO CT MALH PIQ AZ ESC G		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00045-00	CAMISETA MASC POLO MALH PIQ CZ P C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00046-00	CAMISETA MASC POLO MALH PIQ CZ G C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00047-00	CAMISETA MASC POLO MALH PIQ CZ GG C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00048-00	CAMISETA MASC POLO MALH PIQ CZ XG C/LOGO		 	 
UNIFORMES	UN-CAMIS-00049-00	CAMISETA MASC POLO CT MALH PIQ AZ CL P		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00050-00	CAMISETA FEM POLO MALH PIQ CZ PP C/LOGO		 	 
UNIFORMES	UN-CAMIS-00051-00	CAMISETA FEM POLO MALH PIQ CZ P C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00052-00	CAMISETA MASC POLO MALH PIQ VM G C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00053-00	CAMISETA MASC POLO MALH PIQ VM GG C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00054-00	CAMISETA MASC POLO MALH PIQ VN M C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00055-00	CAMISETA MASC POLO MALH PIQ VN GG C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00056-00	CAMISETA MASC POLO CT MALH PIQ VM/VN M		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00057-00	CAMISETA MASC POLO CT MALH PIQ VM/VN G		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00058-00	CAMISETA FEM POLO CT MALH PIQ VM/VN PP		 	 
UNIFORMES	UN-CAMIS-00059-00	CAMISETA FEM POLO 3 BOT MALH PIQ VM/VN M		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00060-00	CAMISETA FEM POLO MALH PIQ VM P C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00061-00	CAMISETA FEM POLO MALH PIQ VN M C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00062-00	CAMISETA FEM POLO MALH PIQ VN P C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00063-00	CAMISETA FEM POLO MALH PIQ VN PP C/LOGO		 	 
UNIFORMES	UN-CAMIS-00064-00	CAMISETA FEM POLO MALH PIQ CZ GG C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00065-00	CAMISETA FEM POLO CT MALH PIQ AZ CL GG		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00066-00	CAMISETA FEM POLO CT MALH PIQ AZ ESC GG		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00067-00	CAMISETA FEM POLO MALHA PIQ AZUL CLARO G C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00068-00	CAMIS SOCIAL BASIC FEMININ MANG LONG AZUL CL TAM 2	CAMIS SOCIAL BASIC TECIDO DOPTEX AZ CL TAM 2	 	 
UNIFORMES	UN-CAMIS-00069-00	CAMIS SOCIAL BASIC MASCULI MG LONGA AZ CLARO TAM 3	CAMISETA SOCIAL BASICA TECIDO DOPTEX BORDADO	 	 
UNIFORMES	UN-CAMIS-00070-00	CAMIS SOCIAL SLIM MASCULI MG LONGA AZ CLARO TAM 2	CAMISETA SOCIAL SLIM MASC TEC DOPTEX BORD HUHTAMAK	 	 
UNIFORMES	UN-CAMIS-00071-00	CAMIS SOCIAL BASIC FEMININ MG LONGA AZ CLARO TAM 3	CAMISETA SOCIAL BASIC FEMININ DOPTEX BORD HUHTAMAK	 	 
UNIFORMES	UN-CAMIS-00072-00	CAMIS SOCIAL SLIM FEMININ MG LONGA AZ CLARO TAM 3	CAMISETA SOCIAL SLIM FEMININ DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00073-00	CAMIS SOCIAL BASIC MASCU MG LONGA AZ CLARO TAM 2	CAMISETA SOCIAL BASIC MASCUL DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00074-00	CAMIS SOCIAL SLIM MASCU MG LONGA AZUL CLARO TAM 3	CAMISETA SOCIAL SLIM MASCUL DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00075-00	CAMIS SOCIAL BASIC FEMIN MG LONGA AZUL CLARO TAM 4	CAMISETA SOCIAL BASIC FEMIN DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00076-00	CAMIS SOCIAL SLIM FEMIN MG LONGA AZUL CLARO TAM 4	CAMISETA SOCIAL SLIM FEMIN DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00077-00	CAMIS SOCIAL BASIC MASC MG LONGA AZUL CLARO TAM 4	CAMISETA SOCIAL BASIC MASC DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00078-00	CAMIS SOCIAL BASIC MASC MG LONGA AZUL CLARO TAM 6	CAMISETA SOCIAL BASIC MASC DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00079-00	CAMIS SOCIAL BASIC FEMIN MANGA LONGA CINZA TAM 2	CAMISETA SOCIAL BASIC FEMI DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00080-00	CAMIS SOCIAL BASIC MASC MANGA LONGA CINZA TAM 2	CAMISETA SOCIAL BASIC MASC DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00081-00	CAMISA SOCIAL SLIM MASC MANGA LONGA CINZA TAM 2	CAMISETA SOCIAL SLIM MASC DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00082-00	CAMIS SOCIAL BASIC FEMIN MANGA LONGA CINZA TAM 3	CAMISETA SOCIAL BASIC FEMI DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00083-00	CAMISA SOCIAL SLIM FEMI MANGA LONGA CINZA TAM 3	CAMISETA SOCIAL SLIM FEMI DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00084-00	CAMIS SOCIAL BASIC MASC MANGA LONGA CINZA TAM 3	CAMISETA SOCIAL BASIC MASC DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00085-00	CAMISA SOCIAL SLIM MASC MANGA LONGA CINZA TAM 3	CAMISETA SOCIAL SLIM MASC DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00086-00	CAMIS SOCIAL BASIC FEMI MANGA LONGA CINZA TAM 4	CAMISETA SOCIAL BASIC FEMI DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00087-00	CAMISA SOCIAL SLIM FEMI MANGA LONGA CINZA TAM 4	CAMISETA SOCIAL SLIM FEMI DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00088-00	CAMIS SOCIAL BASIC MASC MANGA LONGA CINZA TAM 4	CAMISETA SOCIAL BASIC MASC DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00089-00	CAMIS SOCIAL BASIC MASC MANGA LONGA CINZA TAM 6	CAMISETA SOCIAL BASIC MASC DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00090-00	CAMIS SOCIAL BASIC FEMI MANGA CURTA AZUL CL TAM 2	CAMISETA SOCIAL BASIC FEMI DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00091-00	CAMIS SOCIAL BASIC MASC MANGA CURTA AZUL CL TAM 2	CAMISETA SOCIAL BASIC MASC DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00092-00	CAMIS SOCIAL SLIM MASC MANGA CURTA AZUL CL TAM 2	CAMISETA SOCIAL SLIM MASC DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00093-00	CAMIS SOCIAL BASIC FEMI MANGA CURTA AZUL CL TAM 3	CAMISETA SOCIAL BASIC FEMI DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00094-00	CAMIS SOCIAL SLIM FEMI MANGA CURTA AZUL CL TAM 3	CAMISETA SOCIAL SLIM FEMI DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00095-00	CAMIS SOCIAL BASIC MASC MANGA CURTA AZUL CL TAM 3	CAMISETA SOCIAL BASIC MASC DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00096-00	CAMIS SOCIAL SLIM MASC MANGA CURTA AZUL CL TAM 3	CAMISETA SOCIAL SLIM MASC DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00097-00	CAMIS SOCIAL BASIC FEMI MANGA CURTA AZUL CL TAM 4	CAMISETA SOCIAL BASIC FEMI DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00098-00	CAMIS SOCIAL SLIM FEMI MANGA CURTA AZUL CL TAM 3	CAMISETA SOCIAL SLIM FEMI DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00099-00	CAMIS SOCIAL BASIC MASC MANGA CURTA AZUL CL TAM 4	CAMISETA SOCIAL BASIC MASC DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00100-00	CAMIS SOCIAL BASIC MASC MANGA CURTA AZUL CL TAM 6	CAMISETA SOCIAL BASIC MASC DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00101-00	CAMIS SOCIAL SLIM MASCU MG LONGA AZUL CLARO TAM 4	CAMISETA SOCIAL SLIM MASCUL DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00102-00	CAMIS SOCIAL SLIM MASC MANGA CURTA AZUL CL TAM 4	CAMISETA SOCIAL SLIM MASC DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00103-00	CAMISA SOCIAL SLIM MASC MANGA LONGA CINZA TAM 4	CAMISETA SOCIAL SLIM MASC DOPTEX BORD HUHTAMAKI	 	 
UNIFORMES	UN-CAMIS-00104-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ ROYAL T P	FAIXA REFLETIVA PEITO E BRA OS TAM P ELETRICA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00105-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ ROYAL T M	FAIXA REFLETIVA PEITO E BRA OS TAM M  ELETRICA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00106-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ ROYAL T G	FAIXA REFLETIVA PEITO E BRA OS TAM G   ELETRICA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00107-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ ROYAL GG	FAIXA REFLETIVA PEITO E BRA OS TAM GG  ELETRICA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00108-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ CLARO T P	FAIXA REFLETIVA PEITO E BRA OS TAM P  ELETRICA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00109-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ CLARO T M	FAIXA REFLETIVA PEITO E BRA OS TAM M   ELETRICA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00110-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ CLARO T G	FAIXA REFLETIVA PEITO E BRA OS TAM G  ELETRICA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00111-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ CLARO GG	FAIXA REFLETIVA PEITO E BRA OS TAM GG  ELETRICA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00112-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ ESCUR T P	FAIXA REFLETIVA PEITO E BRA OS TAM P ELETRICA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00113-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ ESCUR T M	FAIXA REFLETIVA PEITO E BRA OS TAM M  ELETRICA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00114-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ ESCUR T G	FAIXA REFLETIVA PEITO E BRA OS TAM G  ELETRICA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00115-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ ESCUR GG	FAIXA REFLETIVA PEITO E BRA OS TAM GG ELETRICA	Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00116-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA TAM P		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00117-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA TAM M		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00118-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA TAM G		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00119-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA ELETRI	FAIXA REFLETIVA PEITO E BRA OS TAM GG	 	 
UNIFORMES	UN-CAMIS-00120-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA PALA	AZ MARINHO FREN E TRAS FX REFLTV ELETRICA TAM P	 	 
UNIFORMES	UN-CAMIS-00121-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA PALA	AZ MARINHO FREN E TRAS FX REFLTV ELETRICA TAM M	 	 
UNIFORMES	UN-CAMIS-00122-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA PALA	AZ MARINHO FREN E TRAS FX REFLTV ELETRICA TAM G	 	 
UNIFORMES	UN-CAMIS-00123-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA PALA	AZ MARINHO FREN E TRAS FX REFLTV ELETRICA TAM GG	 	 
UNIFORMES	UN-CAMIS-00124-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA PALA	AZ CLARO FREN E TRAS FX REFLTV ELETRICA TAM P	 	 
UNIFORMES	UN-CAMIS-00125-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA PALA	AZ CLARO FREN E TRAS FX REFLTV ELETRICA TAM M	 	 
UNIFORMES	UN-CAMIS-00126-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA PALA	AZ CLARO FREN E TRAS FX REFLTV ELETRICA TAM G	 	 
UNIFORMES	UN-CAMIS-00127-00	CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA PALA	AZ CLARO FREN E TRAS FX REFLTV ELETRICA TAM GG	 	 
UNIFORMES	UN-CAMIS-00128-00	CAMISETA FEM POLO MALHA PIQ AZUL ESCUR G C/LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00129-00	CAMISETA FEM POLO MALHA PIQ CINZA TAM G COM LOGO		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00130-00	CAMISA MANGA LONGA UNIFORTE PRO FR AZ ESCURO TAM M		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00131-00	CAMISA MANGA LONGA UNIFORTE PRO FR AZ ESCURO TAM G		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00132-00	CAMISA MG LONG BRIM PESADO AZ ESCURO TAMANHO P		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00133-00	CAMISA MG LONG BRIM PESADO AZ ESCURO TAMANHO M		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00134-00	CAMISA MG LONG BRIM PESADO AZ ESCURO TAMANHO G		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00135-00	CAMISA MG LONG BRIM PESDO AZ ESC TAM P FX AZ CL BR		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00136-00	CAMISA MG LONG BRIM PESDO AZ ESC TAM M FX AZ CL BR		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00137-00	CAMISA MG LONG BRIM PESDO AZ ESC TAM G FX AZ CL BR		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00138-00	CAMISA MG LONG BRIM PESDO AZ ESC TAM P FX CZ CL BR		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00139-00	CAMISA MG LONG BRIM PESDO AZ ESC TAM M FX CZ CL BR		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00140-00	CAMISA MG LONG BRIM PESDO AZ ESC TAM G FX CZ CL BR		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00141-00	CAMISA MG LONG BRIM PESADO AZ ESCURO TAMANHO GG		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00142-00	CAMISA MG LONG BRIM PESDO AZ ESC TAM GG FX AZ CL		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00143-00	CAMISA MG LONG BRIM PESDO AZ ESC TAM GG FX CZ CL		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00144-00	CAMISA MANG LONGA CINZA C.A.45165/49124/37837 TM P		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00145-00	CAMISA MANG LONG CNZA C.A.45165/49124/41135 TM M		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00146-00	CAMISA MANG LONG CNZA C.A.45165/49124/41135 TM G		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00147-00	CAMISA MANG LONG CNZA C.A.45165/49124/41135 TM GG		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00148-00	CAMI MANG LONG CZ C.A.45165/49124/37837 FX AZCL TP		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00149-00	CAMI MANG LONG CZ C.A.45165/49124/41135 FX AZCL TM		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00150-00	CAMI MANG LONG CZ C.A.45165/49124/41135 FX AZCL TG		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00151-00	CAMI MANG LONG CZ C.A.45165/49124/41135 FX AZCL GG		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00152-00	CAMI MANG LONG CZ C.A.45165/49124/37837 FX AZESC P		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00153-00	CAMI MANG LONG CZ C.A.45165/49124/41135 FX AZESC M		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00154-00	CAMI MANG LONG CZ C.A.45165/49124/41135 FX AZESC G		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-CAMIS-00155-00	CAMI MANG LONG CZ CA.45165/49124/41135 FX AZ ES GG		Workwear                                          	Purchased materials                                              
UNIFORMES	UN-JALEC-00001-00	JALECO G LYNNO S/JALMASCTAMGMANGLGBRCBOL		 	 
UNIFORMES	UN-JALEC-00002-00	JALECO BR P LYNNO S/JALMASCTAMPMANGLGBR		 	 
UNIFORMES	UN-JALEC-00003-00	JALECO BRANCO MANGA LONGA C/ ELASTICO NAS MANGAS T		 	 
UNIFORMES	UN-JALEC-00004-00	JALECO BR G LYNNO S/JALMASCTAMGMANGLGBR		 	 
UNIFORMES	UN-JALEC-00005-00	JALECO M LYNNO S/JALMASCTAMMMANGLGBRCBOL		 	 `;

const lines = rawData.trim().split('\n').filter(l => l.trim().length > 0);

console.log('Processing rows:', lines.length);

function cleanHuhtamaki(text: string): string {
  return text.replace(/HUHTAMAK[I]?/gi, 'MANUTAMAKI');
}

function extractFabricante(desc: string, extra: string): string {
  const combined = `${desc} ${extra}`.toUpperCase();
  if (combined.includes('SOLASOL')) return 'SOLASOL';
  if (combined.includes('DOPTEX')) return 'DOPTEX';
  if (combined.includes('UNIPARSANT') || combined.includes('UNIPARSAT')) return 'UNIPARSANT';
  if (combined.includes('UNIFORTE')) return 'UNIFORTE';
  if (combined.includes('LYNNO')) return 'LYNNO';
  if (combined.includes('INDURA')) return 'INDURA ULTRA SOFT';
  return 'MANUTAMAKI WORKWEAR';
}

function extractSize(desc: string, extra: string): string {
  const text = `${desc} ${extra}`.toUpperCase();
  const m = text.match(/\b(TAM(?:ANHO)?\s*[A-Z0-9]+|TM\s*[A-Z0-9]+|TAM\.\s*[A-Z0-9]+|"G"|"GG"|"M"|\b(?:38|40|42|44|46|48)\b)\b/i);
  if (m) {
    let s = m[1].replace(/"/g, '').trim();
    if (/^\d{2}$/.test(s)) return `TAM ${s}`;
    if (s.startsWith('TM ')) return `TAM ${s.replace('TM ', '')}`;
    return s;
  }
  // Try matching end of string single letters
  const endMatch = text.match(/\s([P|M|G|GG|XG|PP])(?:\s|$)/);
  if (endMatch) return `TAM ${endMatch[1]}`;
  return 'PADRÃO';
}

function generateKeywords(item: {
  codigo: string;
  descricao: string;
  subcat: string;
  extra: string;
  dimensao: string;
  fabr: string;
}): string[] {
  const tags = new Set<string>();
  tags.add('UNIFORMES');
  tags.add('UNIFORME');
  tags.add('MATERIAL DE USO/CONSUMO');
  tags.add('WORKWEAR');
  tags.add('EPI');
  tags.add('VESTUÁRIO');
  tags.add(item.codigo);
  tags.add(item.subcat.toUpperCase());
  if (item.fabr) tags.add(item.fabr.toUpperCase());
  if (item.dimensao) tags.add(item.dimensao.toUpperCase());

  // Words from desc
  const words = cleanHuhtamaki(`${item.descricao} ${item.extra}`)
    .toUpperCase()
    .replace(/[^A-Z0-9\s/]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !['COM', 'SEM', 'COR', 'DOS', 'DAS', 'PARA', 'PCT'].includes(w));

  for (const w of words) {
    tags.add(w);
  }

  return Array.from(tags);
}

const items: CatalogItem[] = lines.map((line, idx) => {
  const parts = line.split('\t');
  const code = parts[1]?.trim() || `UN-ITEM-${idx + 1}`;
  let desc = cleanHuhtamaki(parts[2]?.trim() || '');
  let extra = cleanHuhtamaki(parts[3]?.trim() || '');
  const subGroup = parts[4]?.trim() || 'Workwear';
  const struct = parts[5]?.trim() || 'Purchased materials';

  let subcat = 'Uniformes Operacionais';
  let img = '/assets/components/uniforme-camisa.svg';

  if (code.includes('CALCA')) {
    subcat = 'Calças e Bermudas';
    img = '/assets/components/uniforme-calca.svg';
  } else if (code.includes('CAMIS')) {
    subcat = 'Camisas e Camisetas';
    img = '/assets/components/uniforme-camisa.svg';
  } else if (code.includes('JALEC')) {
    subcat = 'Jalecos e Aventais';
    img = '/assets/components/uniforme-jaleco.svg';
  }

  const fabr = extractFabricante(desc, extra);
  const dimensao = extractSize(desc, extra);
  const palavrasChave = generateKeywords({
    codigo: code,
    descricao: desc,
    subcat,
    extra,
    dimensao,
    fabr,
  });

  const obs = extra ? `${extra}. Classificação: ${struct}.` : `Uniforme operacional padronizado Manutamaki. Classificação: ${struct}.`;

  return {
    id: `uc-un-${String(idx + 1).padStart(3, '0')}`,
    codigo: code,
    descricao: desc,
    categoria: 'MATERIAL DE USO/CONSUMO',
    subcategoria: subcat,
    materialGroup: subGroup || 'Workwear',
    materialStructure: struct || 'Workwear',
    fabricante: fabr,
    dimensao,
    localizacao: 'Almoxarifado Central - Vestiário / Setor UN',
    status: 'disponivel',
    observacoes: obs,
    palavrasChave,
    imagemUrl: img,
  };
});

const tsFileContent = `import { CatalogItem } from '../types';

/**
 * Catálogo completo de 234 itens de Material de Uso/Consumo (Uniformes Operacionais)
 * Parte integrante dos 2.336 itens do CATALOGO_MANUTENCAO_BASE_ATUALIZADA.
 */
export const ITENS_MATERIAL_USO_CONSUMO: CatalogItem[] = ${JSON.stringify(items, null, 2)};
`;

fs.writeFileSync('src/data/materialUsoConsumo.ts', tsFileContent, 'utf8');
console.log('Successfully generated src/data/materialUsoConsumo.ts with', items.length, 'items!');
