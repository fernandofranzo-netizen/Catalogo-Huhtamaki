const fs = require('fs');
const path = require('path');

// Raw 234 items from CATALOGO_MANUTENCAO_BASE_ATUALIZADA (UNIFORMES)
// Total 234: 73 Calças (UN-CALCA-00001-00 to UN-CALCA-00073-00)
//           155 Camisas/Camisetas (UN-CAMIS-00001-00 to UN-CAMIS-00155-00)
//             6 Jalecos (UN-JALEC-00001-00 to UN-JALEC-00006-00)

const RAW_UNIFORMES_234 = [
  // --- CALÇAS (73 itens) ---
  { codigo: 'UN-CALCA-00001-00', descricao: 'CALCA PROFIS SOLASOL AZ MAR UNID TRAD 38', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00002-00', descricao: 'CALCA PROFIS SOLASOL AZ MAR UNID TRAD 40', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00003-00', descricao: 'CALCA PROFIS SOLASOL AZ MAR UNID TRAD 42', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00004-00', descricao: 'CALCA PROFIS SOLASOL AZ MAR UNID TRAD 44', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00005-00', descricao: 'CALCA PROFIS SOLASOL AZ MAR UNID TRAD 46', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00006-00', descricao: 'CALCA PROFIS SOLASOL AZ MAR UNID TRAD 48', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00007-00', descricao: 'CALCA SEG 88PCT ALGOD/12PCT NY CZ P', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00008-00', descricao: 'CALCA SEG 88PCT ALGOD/12PCT NY CZ G', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00009-00', descricao: 'CALCA SEG 88PCT ALGOD/12PCT NY CZ P', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00010-00', descricao: 'CALCA BRIM UNISEX COR AZUL BIC COS ELASTT TAM PP', descricaoExtra: '2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00011-00', descricao: 'CALCA BRIM UNISEX COR AZUL BIC COS ELASTT TAM P', descricaoExtra: '2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00012-00', descricao: 'CALCA BRIM UNISEX COR AZUL BIC COS ELASTT TAM M', descricaoExtra: '2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00013-00', descricao: 'CALCA BRIM UNISEX COR AZUL BIC COS ELASTT TAM G', descricaoExtra: '2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00014-00', descricao: 'CALCA BRIM UNISEX COR AZUL BIC COS ELASTT TAM GG', descricaoExtra: '2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00015-00', descricao: 'CALCA BRIM UNISEX COR CINZA COS ELAST TT TAM PP', descricaoExtra: 'BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA PERNA', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00016-00', descricao: 'CALCA BRIM UNISEX COR CINZA COS ELAST TT TAM P', descricaoExtra: 'BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA PERNA', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00017-00', descricao: 'CALCA BRIM UNISEX COR CINZA COS ELAST TT TAM M', descricaoExtra: 'BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA PERNA', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00018-00', descricao: 'CALCA BRIM UNISEX COR CINZA COS ELAST TT TAM G', descricaoExtra: 'BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA PERNA', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00019-00', descricao: 'CALCA BRIM UNISEX COR CINZA COS ELAST TT TAM GG', descricaoExtra: 'BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA PERNA', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00020-00', descricao: 'CALCA BRIM UNISEX COR CINZA COS ELAST TT TAM XG', descricaoExtra: 'BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA NA PERNA', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00021-00', descricao: 'CALCA BRIM UNISEX COR AZUL ESCURO COS ELATT TAM P', descricaoExtra: '2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00022-00', descricao: 'CALCA BRIM UNISEX COR AZUL ESCURO COS ELATT TAM M', descricaoExtra: '2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00023-00', descricao: 'CALCA BRIM UNISEX COR AZUL ESCURO COS ELATT TAM G', descricaoExtra: '2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00024-00', descricao: 'CALCA BRIM UNISEX COR AZUL ESCURO COS ELATT TAM GG', descricaoExtra: '2 BOLSOS NA FRENTE 2 BOLSOS ATRAS COM BARRA', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00025-00', descricao: 'CALCA SEG UNIPARSANT 237GRS AZUL ROYAL FAIXA REFLT', descricaoExtra: 'JOELHO ELETRICA TAM P', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00026-00', descricao: 'CALCA SEG UNIPARSANT 237GRS AZUL ROYAL FAIXA REFLT', descricaoExtra: 'JOELHO ELETRICA TAM M', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00027-00', descricao: 'CALCA SEG UNIPARSANT 237GRS AZUL ROYAL FAIXA REFLT', descricaoExtra: 'JOELHO ELETRICA TAM G', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00028-00', descricao: 'CALCA SEG UNIPARSANT 237GRS AZUL ROYAL FAIXA REFLT', descricaoExtra: 'JOELHO ELETRICA TAM GG', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00029-00', descricao: 'CALCA SEG UNIPARSANT 237GRS AZUL CLARO TAM P', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00030-00', descricao: 'CALCA SEG UNIPARSANT 237GRS AZUL CLARO TAM M', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00031-00', descricao: 'CALCA SEG UNIPARSANT 237GRS AZUL CLARO TAM G FX RE', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00032-00', descricao: 'CALCA SEG UNIPARSANT 237GRS AZUL CLARO TAM GG FX R', descricaoExtra: 'JOELHO ELETRICA TAM GG', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00033-00', descricao: 'CALCA SEG UNIPARSANT 237GRS AZUL ESCUR TAM P', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00034-00', descricao: 'CALCA SEG UNIPARSANT 237GRS AZUL ESCUR TAM M', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00035-00', descricao: 'CALCA SEG UNIPARSANT 237GRS AZUL ESCUR TAM G', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00036-00', descricao: 'CALCA SEG UNIPARSANT 237GRS AZUL ESCUR FAIXA REFLT', descricaoExtra: 'JOELHO ELETRICA TAM GG', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00037-00', descricao: 'CALCA SEG UNIPARSANT 237GRS CINZA TOTAL FX TAM P', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00038-00', descricao: 'CALCA SEG UNIPARSANT 237GRS CINZA TOTAL FX TAM M', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00039-00', descricao: 'CALCA SEG UNIPARSANT 237GRS CINZA TOTAL FX TAM G', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00040-00', descricao: 'CALCA SEG UNIPARSANT 237GRS CINZA TOTAL FX REFLTV', descricaoExtra: 'CALCANHAR ELETRICISTA TAM GG', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00041-00', descricao: 'CALCA SEG UNIPARSANT 237GRS CINZA COM FX AZ CLARO', descricaoExtra: 'JOELHO FX REFTV CALCANHR ELETRICISTA TAM P', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00042-00', descricao: 'CALCA SEG UNIPARSANT 237GRS CINZA COM FX AZ CLARO', descricaoExtra: 'JOELHO FX REFTV CALCANHR ELETRICISTA TAM M', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00043-00', descricao: 'CALCA SEG UNIPARSANT 237GRS CINZA COM FX AZ CLARO', descricaoExtra: 'JOELHO FX REFTV CALCANHR ELETRICISTA TAM G', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00044-00', descricao: 'CALCA SEG UNIPARSANT 237GRS CINZA COM FX AZ CLARO', descricaoExtra: 'JOELHO FX REFTV CALCANHR ELETRICISTA TAM GG', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00045-00', descricao: 'CALCA SEG UNIPARSANT 237GRS CINZA COM FX AZ ESCURO', descricaoExtra: 'JOELHO FX REFTV CALCANHR ELETRICISTA TAM P', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00046-00', descricao: 'CALCA SEG UNIPARSANT 237GRS CINZA COM FX AZ ESCURO', descricaoExtra: 'JOELHO FX REFTV CALCANHR ELETRICISTA TAM M', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00047-00', descricao: 'CALCA SEG UNIPARSANT 237GRS CINZA COM FX AZ ESCURO', descricaoExtra: 'JOELHO FX REFTV CALCANHR ELETRICISTA TAM G', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00048-00', descricao: 'CALCA SEG UNIPARSANT 237GRS CINZA COM FX AZ ESCURO', descricaoExtra: 'JOELHO FX REFTV CALCANHR ELETRICISTA TAM GG', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00049-00', descricao: 'CALCA SEG UNIFORTE PRO FR 100PC ALGO AZ ESC TM G', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00050-00', descricao: 'CALCA AZ MARINHO BRIM PESADO TAM P', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00051-00', descricao: 'CALCA AZ MARINHO BRIM PESADO TAM M', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00052-00', descricao: 'CALCA AZ MARINHO BRIM PESADO TAM G', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00053-00', descricao: 'CALCA AZ MARINHO BRIM PESADO TAM GG', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00054-00', descricao: 'CALCA AZ MARINHO BRIM PESADO FX AZ CL TAM P', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00055-00', descricao: 'CALCA AZ MARINHO BRIM PESADO FX AZ CL TAM M', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00056-00', descricao: 'CALCA AZ MARINHO BRIM PESADO FX AZ CL TAM G', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00057-00', descricao: 'CALCA AZ MARINHO BRIM PESADO FX AZ CL TAM GG', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00058-00', descricao: 'CALCA AZ MARINHO BRIM PESADO FX CZ CL TAM P', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00059-00', descricao: 'CALCA AZ MARINHO BRIM PESADO FX CZ CL TAM M', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00060-00', descricao: 'CALCA AZ MARINHO BRIM PESADO FX CZ CL TAM G', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00061-00', descricao: 'CALCA AZ MARINHO BRIM PESADO FX CZ CL TAM GG', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00062-00', descricao: 'CALCA CINZA FX REFLE C.A.45165/49122/37839 TM P', ca: '45165/49122/37839', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00063-00', descricao: 'CALCA CINZA FX REFLE C.A.45165/49122/41136 TM M', ca: '45165/49122/41136', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00064-00', descricao: 'CALCA CINZA FX REFLE C.A.45165/49122/41136 TM G', ca: '45165/49122/41136', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00065-00', descricao: 'CALCA CINZA FX REFLE C.A.45165/49122/41136 TM GG', ca: '45165/49122/41136', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00066-00', descricao: 'CALCA CINZ FX REFL COM FAIXA AZUL CLARO TAMANHO P', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00067-00', descricao: 'CALCA CINZ FX REFL COM FAIXA AZUL CLARO TAMANHO M', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00068-00', descricao: 'CALCA CINZ FX REFL COM FAIXA AZUL CLARO TAMANHO G', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00069-00', descricao: 'CALCA CINZ FX REFL COM FAIXA AZUL CLARO TAMANHO GG', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00070-00', descricao: 'CALCA CINZA FX REFL COM FAIXA AZUL ESCURO TM P', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00071-00', descricao: 'CALCA CINZA FX REFL COM FAIXA AZUL ESCURO TM M', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00072-00', descricao: 'CALCA CINZA FX REFL COM FAIXA AZUL ESCURO TM G', subcategoria: 'Calças e Bermudas Profissionais' },
  { codigo: 'UN-CALCA-00073-00', descricao: 'CALCA CINZX FX REFL COM FAIXA AZUL ESCURO TM GG', subcategoria: 'Calças e Bermudas Profissionais' },

  // --- CAMISAS E CAMISETAS (155 itens) ---
  { codigo: 'UN-CAMIS-00001-00', descricao: 'CAMISA AZUL MARINHO POLIVISCOSE POLO MASCULINA "G"', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00002-00', descricao: 'CAMISA AZUL MARINHO POLIVISCOSE POLO MASCULINA "GG"', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00003-00', descricao: 'CAMISA MASC POLO 3 BOT AZ MAR M C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00004-00', descricao: 'CAMISETA MASC 50PCT ALG/50PCT PES VM G', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00005-00', descricao: 'CAMISETA MASC 50PCT ALG/50PCT PES VM GG', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00006-00', descricao: 'CAMISETA MASC 50PCT ALG/50PCT PES VM M', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00007-00', descricao: 'CAMISA POLO MALHA PIQUET CINZA P/EMPILHADOR "M"', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00008-00', descricao: 'CAMISA POLO MALHA PIQUET CINZA P/EMPILHADOR "G"', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00009-00', descricao: 'CAMISA POLO MALHA PIQUET CINZA P/EMPILHADOR "GG"', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00010-00', descricao: 'CAMISA SEGURANCA MANGA LONGA INDURA ULTRA SOFT STY', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00011-00', descricao: 'CAMISA POLO BASICA AZUL MARINHO TAM 2', descricaoExtra: 'CAMISETA SOCIAL SLIM MASC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00012-00', descricao: 'CAMISA SEGURANCA MANGA LONGA INDURA ULTRA SOFT STY', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00013-00', descricao: 'CAMISA SEGURANCA MANGA LONGA RETARDANTE CHAMAS MEC', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00014-00', descricao: 'CAMISA SEGURANCA MANGA LONGA RETARDANTE CHAMAS MEC', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00015-00', descricao: 'CAMISA MANGA LONGA AZUL 4 BOLSOS REFL NO TORAX', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00016-00', descricao: 'CAMISA MANGA CURTA AZUL 4 BOLSOS REFL NO TORAX TAM', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00017-00', descricao: 'CAMISA MANGA LONGA AZUL 4 BOLSOSREFL NO TORAX TAM', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00018-00', descricao: 'CAMISA MANGA CURTA AZUL 4 BOLSOS REFL NO TORAX TAM', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00019-00', descricao: 'CAMISA MANGA CURTA AZUL 4 BOLSOS REFL NO TORAX TAM', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00020-00', descricao: 'CAMISA MANGA LONGA AZUL 4 BOLSOS REFL NO TORAX TAM', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00021-00', descricao: 'CAMISETA MASC POLO CT MALH PIQ AZ ESC P', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00022-00', descricao: 'CAMISETA MASC POLO CT AZ MAR M C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00023-00', descricao: 'CAMISETA MASC POLO CT MALH PIQ AZ ESC P', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00024-00', descricao: 'CAMISETA MASC POLO CT MALH PIQ AZ ESC M', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00025-00', descricao: 'CAMISETA MASC POLO CT MALH PIQ AZ ESC GG', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00026-00', descricao: 'CAMISETA MASC POLO CT MALH PIQ AZ ESC XG', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00027-00', descricao: 'CAMISETA MASC POLO CT MALH PIQ AZ CL PP', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00028-00', descricao: 'CAMISETA MASC POLO CT MALH PIQ AZ CL M', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00029-00', descricao: 'CAMISETA MASC POLO CT MALH PIQ AZ CL G', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00030-00', descricao: 'CAMISETA MASC POLO CT MALH PIQ AZ CL GG', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00031-00', descricao: 'CAMISETA MASC POLO CT MALH PIQ AZ CL XG', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00032-00', descricao: 'CAMISETA FEM POLO CT MALH PIQ AZ ESC PP', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00033-00', descricao: 'CAMISETA FEM POLO CT MALH PIQ AZ ESC P', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00034-00', descricao: 'CAMISETA FEM POLO CT MALH PIQ AZ ESC M', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00035-00', descricao: 'CAMISETA FEM POLO CT MALH PIQ AZ ESC G', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00036-00', descricao: 'CAMISETA FEM POLO CT MALH PIQ AZ ESC GG', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00037-00', descricao: 'CAMISETA FEM 3 BOT MALH PIQ AZ CL P', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00038-00', descricao: 'CAMISETA FEM 3 BOT MALH PIQ AZ CL M', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00039-00', descricao: 'CAMISETA MASC POLO MALH PIQ VM P C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00040-00', descricao: 'CAMISETA MASC POLO MALH PIQ VM G C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00041-00', descricao: 'CAMISETA MASC POLO CT MALH PIQ VM/VN GG', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00042-00', descricao: 'CAMISETA MASC POLO 3 BOT MALH PIQ VM/VN XG', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00043-00', descricao: 'CAMISETA FEM POLO MALH PIQ VM PP C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00044-00', descricao: 'CAMISETA FEM POLO MALH PIQ VM M C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00045-00', descricao: 'CAMISETA MASC POLO CT MALH PIQ CZ ESC G', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00046-00', descricao: 'CAMISETA MASC POLO MALH PIQ CZ P C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00047-00', descricao: 'CAMISETA MASC POLO MALH PIQ CZ M C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00048-00', descricao: 'CAMISETA MASC POLO MALH PIQ CZ GG C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00049-00', descricao: 'CAMISETA MASC POLO MALH PIQ CZ XG C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00050-00', descricao: 'CAMISETA FEM POLO CT MALH PIQ AZ CL P', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00051-00', descricao: 'CAMISETA FEM POLO MALH PIQ CZ PP C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00052-00', descricao: 'CAMISETA FEM POLO MALH PIQ CZ P C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00053-00', descricao: 'CAMISETA FEM POLO MALH PIQ VM M C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00054-00', descricao: 'CAMISETA MASC POLO MALH PIQ GG C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00055-00', descricao: 'CAMISETA MASC POLO MALH PIQ VM GG C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00056-00', descricao: 'CAMISETA MASC POLO MALH PIQ VM XG C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00057-00', descricao: 'CAMISETA MASC POLO CT MALH PIQ VM/VN M', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00058-00', descricao: 'CAMISETA FEM POLO MALH PIQ VM P C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00059-00', descricao: 'CAMISETA FEM POLO CT MALH PIQ VM/VN PP', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00060-00', descricao: 'CAMISETA FEM POLO 3 BOT MALH PIQ VM/VN M', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00061-00', descricao: 'CAMISETA FEM POLO MALH PIQ CZ G C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00062-00', descricao: 'CAMISETA FEM POLO MALH PIQ VM M C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00063-00', descricao: 'CAMISETA FEM POLO MALH PIQ VN P C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00064-00', descricao: 'CAMISETA FEM POLO MALH PIQ VN M C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00065-00', descricao: 'CAMISETA FEM POLO MALH PIQ CZ GG C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00066-00', descricao: 'CAMISETA FEM POLO CT MALH PIQ AZ CL GG', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00067-00', descricao: 'CAMISETA FEM POLO CT MALH PIQ AZ ESC GG', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00068-00', descricao: 'CAMISETA FEM POLO MALHA PIQ AZUL CLARO C/LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00069-00', descricao: 'CAMIS SOCIAL BASIC FEMININ MANG LONG AZUL CL TAM 2', descricaoExtra: 'CAMIS SOCIAL BASIC TECIDO DOPTEX BORDADO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00070-00', descricao: 'CAMIS SOCIAL BASIC MASCULI MG LONGA AZ CLARO TAM 3', descricaoExtra: 'CAMISETA SOCIAL BASICA TECIDO DOPTEX BORDADO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00071-00', descricao: 'CAMIS SOCIAL SLIM MASCULI MG LONGA AZ CLARO TAM 2', descricaoExtra: 'CAMISETA SOCIAL SLIM MASC TEC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00072-00', descricao: 'CAMIS SOCIAL BASIC FEMININ MG LONGA AZ CLARO TAM 3', descricaoExtra: 'CAMISETA SOCIAL BASIC FEMININ DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00073-00', descricao: 'CAMIS SOCIAL SLIM FEMININ MG LONGA AZ CLARO TAM 3', descricaoExtra: 'CAMISETA SOCIAL SLIM FEMIN DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00074-00', descricao: 'CAMIS SOCIAL BASIC MASCU MG LONGA AZ CLARO TAM 2', descricaoExtra: 'CAMISETA SOCIAL BASIC MASCUL DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00075-00', descricao: 'CAMIS SOCIAL SLIM MASCUL MG LONGA AZUL CLARO TAM 3', descricaoExtra: 'CAMISETA SOCIAL SLIM MASCUL DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00076-00', descricao: 'CAMIS SOCIAL BASIC FEMINI MG LONGA AZUL CLARO TAM 4', descricaoExtra: 'CAMISETA SOCIAL BASIC FEMIN DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00077-00', descricao: 'CAMIS SOCIAL SLIM FEMIN MG LONGA AZUL CLARO TAM 4', descricaoExtra: 'CAMISETA SOCIAL SLIM FEMIN DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00078-00', descricao: 'CAMIS SOCIAL BASIC MASC MG LONGA AZUL CLARO TAM 4', descricaoExtra: 'CAMISETA SOCIAL BASIC MASC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00079-00', descricao: 'CAMIS SOCIAL SLIM MASC MG LONGA AZUL CLARO TAM 4', descricaoExtra: 'CAMISETA SOCIAL SLIM MASC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00080-00', descricao: 'CAMIS SOCIAL BASIC FEMIN MANGA LONGA CINZA TAM 2', descricaoExtra: 'CAMISETA SOCIAL BASIC FEMIN DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00081-00', descricao: 'CAMIS SOCIAL BASIC MASC MANGA LONGA CINZA TAM 2', descricaoExtra: 'CAMISETA SOCIAL BASIC MASC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00082-00', descricao: 'CAMIS SOCIAL BASIC MASC MANGA LONGA CINZA TAM 3', descricaoExtra: 'CAMISETA SOCIAL BASIC MASC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00083-00', descricao: 'CAMIS SOCIAL BASIC FEMIN MANGA LONGA CINZA TAM 3', descricaoExtra: 'CAMISETA SOCIAL BASIC FEMIN DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00084-00', descricao: 'CAMIS SOCIAL SLIM FEMI MANGA LONGA CINZA TAM 3', descricaoExtra: 'CAMISETA SOCIAL SLIM FEMI DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00085-00', descricao: 'CAMIS SOCIAL BASIC MASC MANGA LONGA CINZA TAM 3', descricaoExtra: 'CAMISETA SOCIAL BASIC MASC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00086-00', descricao: 'CAMIS SOCIAL BASIC FEMIN MANGA LONGA CINZA TAM 4', descricaoExtra: 'CAMISETA SOCIAL BASIC FEMIN DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00087-00', descricao: 'CAMIS SOCIAL SLIM FEMI MANGA LONGA CINZA TAM 4', descricaoExtra: 'CAMISETA SOCIAL SLIM FEMI DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00088-00', descricao: 'CAMIS SOCIAL BASIC MASC MANGA LONGA CINZA TAM 4', descricaoExtra: 'CAMISETA SOCIAL BASIC MASC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00089-00', descricao: 'CAMIS SOCIAL SLIM MASC MANGA LONGA CINZA TAM 4', descricaoExtra: 'CAMISETA SOCIAL SLIM MASC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00090-00', descricao: 'CAMIS SOCIAL BASIC MASC MANGA LONGA CINZA TAM 6', descricaoExtra: 'CAMISETA SOCIAL BASIC MASC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00091-00', descricao: 'CAMIS SOCIAL BASIC FEMIN MANGA CURTA AZUL CL TAM 2', descricaoExtra: 'CAMISETA SOCIAL BASIC FEMIN DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00092-00', descricao: 'CAMIS SOCIAL BASIC MASC MANGA CURTA AZUL CL TAM 2', descricaoExtra: 'CAMISETA SOCIAL BASIC MASC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00093-00', descricao: 'CAMIS SOCIAL SLIM MASC MANGA CURTA AZUL CL TAM 2', descricaoExtra: 'CAMISETA SOCIAL SLIM MASC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00094-00', descricao: 'CAMIS SOCIAL BASIC FEMI MANGA CURTA AZUL CL TAM 3', descricaoExtra: 'CAMISETA SOCIAL BASIC FEMI DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00095-00', descricao: 'CAMIS SOCIAL SLIM FEMI MANGA CURTA AZUL CL TAM 3', descricaoExtra: 'CAMISETA SOCIAL SLIM FEMI DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00096-00', descricao: 'CAMIS SOCIAL BASIC MASC MANGA CURTA AZUL CL TAM 3', descricaoExtra: 'CAMISETA SOCIAL BASIC MASC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00097-00', descricao: 'CAMIS SOCIAL SLIM MASC MANGA CURTA AZUL CL TAM 3', descricaoExtra: 'CAMISETA SOCIAL SLIM MASC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00098-00', descricao: 'CAMIS SOCIAL BASIC FEMI MANGA CURTA AZUL CL TAM 4', descricaoExtra: 'CAMISETA SOCIAL BASIC FEMI DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00099-00', descricao: 'CAMIS SOCIAL SLIM FEMI MANGA CURTA AZUL CL TAM 4', descricaoExtra: 'CAMISETA SOCIAL SLIM FEMI DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00100-00', descricao: 'CAMIS SOCIAL BASIC MASC MANGA CURTA AZUL CL TAM 4', descricaoExtra: 'CAMISETA SOCIAL BASIC MASC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00101-00', descricao: 'CAMIS SOCIAL SLIM MASC MANGA CURTA AZUL CL TAM 4', descricaoExtra: 'CAMISETA SOCIAL SLIM MASC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00102-00', descricao: 'CAMIS SOCIAL SLIM MASC MANGA LONGA AZUL CLARO TAM 4', descricaoExtra: 'CAMISETA SOCIAL SLIM MASC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00103-00', descricao: 'CAMIS SOCIAL SLIM MASC MANGA CURTA AZUL CL TAM 4', descricaoExtra: 'CAMISETA SOCIAL SLIM MASC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00104-00', descricao: 'CAMIS SOCIAL BASIC MASC MANGA CURTA AZUL CL TAM 6', descricaoExtra: 'CAMISETA SOCIAL BASIC MASC DOPTEX BORD MANUTAMAKI', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00105-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ ROYAL T P', descricaoExtra: 'FAIXA REFLETIVA PEITO E BRACOS TAM P ELETRICA', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00106-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ ROYAL T M', descricaoExtra: 'FAIXA REFLETIVA PEITO E BRACOS TAM M ELETRICA', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00107-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ ROYAL T G', descricaoExtra: 'FAIXA REFLETIVA PEITO E BRACOS TAM G ELETRICA', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00108-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ ROYAL GG', descricaoExtra: 'FAIXA REFLETIVA PEITO E BRACOS TAM GG ELETRICA', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00109-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ CLARO T P', descricaoExtra: 'FAIXA REFLETIVA PEITO E BRACOS TAM P ELETRICA', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00110-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ CLARO T M', descricaoExtra: 'FAIXA REFLETIVA PEITO E BRACOS TAM M ELETRICA', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00111-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ CLARO T G', descricaoExtra: 'FAIXA REFLETIVA PEITO E BRACOS TAM G ELETRICA', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00112-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ CLARO GG', descricaoExtra: 'FAIXA REFLETIVA PEITO E BRACOS TAM GG ELETRICA', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00113-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ ESCUR T P', descricaoExtra: 'FAIXA REFLETIVA PEITO E BRACOS TAM P ELETRICA', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00114-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ ESCUR T M', descricaoExtra: 'FAIXA REFLETIVA PEITO E BRACOS TAM M ELETRICA', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00115-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ ESCUR T G', descricaoExtra: 'FAIXA REFLETIVA PEITO E BRACOS TAM G ELETRICA', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00116-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS AZ ESCUR GG', descricaoExtra: 'FAIXA REFLETIVA PEITO E BRACOS TAM GG ELETRICA', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00117-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA TALA P', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00118-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA TALA M', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00119-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA TAM G', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00120-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA TAM GG', descricaoExtra: 'FAIXA REFLETIVA PEITO E BRACOS TAM GG', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00121-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA PALA', descricaoExtra: 'AZ MARINHO FREN E TRAS FX REFLTV ELETRICA TAM P', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00122-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA PALA', descricaoExtra: 'AZ MARINHO FREN E TRAS FX REFLTV ELETRICA TAM M', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00123-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA PALA', descricaoExtra: 'AZ MARINHO FREN E TRAS FX REFLTV ELETRICA TAM G', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00124-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA PALA', descricaoExtra: 'AZ MARINHO FREN E TRAS FX REFLTV ELETRICA TAM GG', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00125-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA PALA', descricaoExtra: 'AZ CLARO FREN E TRAS FX REFLTV ELETRICA TAM P', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00126-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA PALA', descricaoExtra: 'AZ CLARO FREN E TRAS FX REFLTV ELETRICA TAM M', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00127-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA PALA', descricaoExtra: 'AZ CLARO FREN E TRAS FX REFLTV ELETRICA TAM G', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00128-00', descricao: 'CAMISA MANGA LONGA UNIPARSANT 237 GRS CINZA PALA', descricaoExtra: 'AZ CLARO FREN E TRAS FX REFLTV ELETRICA TAM GG', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00129-00', descricao: 'CAMISETA FEM POLO MALHA PIQ TAM G COM LOGO', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00130-00', descricao: 'CAMISA MANGA LONGA UNIFORTE PRO FR ESCURO TAM M', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00131-00', descricao: 'CAMISA MANGA LONGA UNIFORTE PRO FR ESCURO TAM G', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00132-00', descricao: 'CAMISA MG LONG BRIM PESDO AZ ESCURO TAMANHO P', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00133-00', descricao: 'CAMISA MG LONG BRIM PESDO AZ ESCURO TAMANHO M', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00134-00', descricao: 'CAMISA MG LONG BRIM PESDO AZ ESCURO TAMANHO G', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00135-00', descricao: 'CAMISA MG LONG BRIM PESDO AZ ESC TAM P FX AZ CL BR', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00136-00', descricao: 'CAMISA MG LONG BRIM PESDO AZ ESC TAM M FX AZ CL BR', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00137-00', descricao: 'CAMISA MG LONG BRIM PESDO AZ ESC TAM G FX AZ CL BR', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00138-00', descricao: 'CAMISA MG LONG BRIM PESDO AZ ESC TAM P FX CZ CL BR', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00139-00', descricao: 'CAMISA MG LONG BRIM PESDO AZ ESC TAM M FX CZ CL BR', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00140-00', descricao: 'CAMISA MG LONG BRIM PESDO AZ ESC TAM G FX CZ CL BR', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00141-00', descricao: 'CAMISA MG LONG BRIM PESDO AZ ESCURO TAMANHO GG', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00142-00', descricao: 'CAMISA MG LONG BRIM PESDO AZ ESC TAM GG FX AZ CL', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00143-00', descricao: 'CAMISA MG LONG BRIM PESDO AZ ESC TAM GG FX CZ CL', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00144-00', descricao: 'CAMISA MANGA LONGA CINZA C.A.45165/49124/37837 TM P', ca: '45165/49124/37837', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00145-00', descricao: 'CAMISA MANGA LONGA CNZA C.A.45165/49124/41135 TM M', ca: '45165/49124/41135', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00146-00', descricao: 'CAMISA MANGA LONGA CNZA C.A.45165/49124/41135 TM G', ca: '45165/49124/41135', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00147-00', descricao: 'CAMISA MANG LONG CNZA C.A.45165/49124/41135 TM GG', ca: '45165/49124/41135', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00148-00', descricao: 'CAMI MANG LONG CZ C.A.45165/49124/37837 FX AZCL TP', ca: '45165/49124/37837', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00149-00', descricao: 'CAMI MANG LONG CZ C.A.45165/49124/41135 FX AZCL TM', ca: '45165/49124/41135', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00150-00', descricao: 'CAMI MANG LONG CZ C.A.45165/49124/41135 FX AZCL TG', ca: '45165/49124/41135', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00151-00', descricao: 'CAMI MANG LONG CZ C.A.45165/49124/41135 FX AZCL TGG', ca: '45165/49124/41135', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00152-00', descricao: 'CAMI MANG LONG CZ C.A.45165/49124/37837 FX AZESC P', ca: '45165/49124/37837', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00153-00', descricao: 'CAMI MANG LONG CZ C.A.45165/49124/41135 FX AZESC M', ca: '45165/49124/41135', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00154-00', descricao: 'CAMI MANG LONG CZ C.A.45165/49124/41135 FX AZESC G', ca: '45165/49124/41135', subcategoria: 'Camisas e Camisetas Operacionais' },
  { codigo: 'UN-CAMIS-00155-00', descricao: 'CAMI MANG LONG CZ C.A.45165/49124/41135 FX AZ ES GG', ca: '45165/49124/41135', subcategoria: 'Camisas e Camisetas Operacionais' },

  // --- JALECOS E AVENTAIS (6 itens) ---
  { codigo: 'UN-JALEC-00001-00', descricao: 'JALECO BR PP S/ALMASCTAMPMANGLGBR', subcategoria: 'Jalecos e Aventais' },
  { codigo: 'UN-JALEC-00002-00', descricao: 'JALECO BR PP S/ALMASCTAMPMANGLGBR', subcategoria: 'Jalecos e Aventais' },
  { codigo: 'UN-JALEC-00003-00', descricao: 'JALECO BRANCO MANGA LONGA C/ ELASTICO NAS MANGAS T', subcategoria: 'Jalecos e Aventais' },
  { codigo: 'UN-JALEC-00004-00', descricao: 'JALECO BRANCO MANGA LONGA C/ PUNHO DE MALHA T. G', subcategoria: 'Jalecos e Aventais' },
  { codigo: 'UN-JALEC-00005-00', descricao: 'JALECO M LYMNO S/ALMASCTAMMANGLGBRCBOL', subcategoria: 'Jalecos e Aventais' },
  { codigo: 'UN-JALEC-00006-00', descricao: 'JALECO BRANCO OXFORD MANGA CURTA BORDADO MANUTAMAKI', subcategoria: 'Jalecos e Aventais' }
];

console.log('Total RAW Uniformes:', RAW_UNIFORMES_234.length);

const catalogPath = path.resolve(__dirname, '../src/data/catalogItems.json');
const currentCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Filter out existing UN- items if any
const baseCatalog = currentCatalog.filter(i => !i.codigo.startsWith('UN-') && !i.codigo.endsWith('-TEC'));

function getKeywords(item) {
  const words = new Set();
  const text = `${item.codigo} ${item.descricao} ${item.categoria} ${item.subcategoria} ${item.observacoes || ''} ${item.materialStructure || ''}`;
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\sáàâãéèêíïóôõöúçñ-]/g, ' ')
    .split(/[\s,/\-_.]+/)
    .forEach((w) => {
      if (w.length >= 2) words.add(w);
    });
  return Array.from(words);
}

const formattedUniformItems = RAW_UNIFORMES_234.map((raw) => {
  const parts = raw.codigo.split('-');
  const subcode = parts[1] || 'UNIF';
  const num = parts[2] || '00000';
  const obs = [];
  if (raw.descricaoExtra) obs.push(`Extra: ${raw.descricaoExtra}`);
  if (raw.ca) obs.push(`C.A.: ${raw.ca}`);
  obs.push('Material: Workwear / Manutamaki');

  const itemObj = {
    id: `item-un-${subcode.toLowerCase()}-${num}`,
    codigo: raw.codigo,
    descricao: raw.descricao,
    categoria: 'UNIFORMES',
    subcategoria: raw.subcategoria,
    materialStructure: subcode,
    materialGroup: 'Workwear',
    localizacao: 'Almoxarifado Central - Vestiário / Uniformes',
    status: 'disponivel',
    favorito: false,
    documentos: [],
    observacoes: obs.join(' | '),
    imagemUrl: '/assets/components/uniforme-operacional.svg',
  };

  itemObj.palavrasChave = getKeywords(itemObj);
  return itemObj;
});

const newCatalog = [...baseCatalog, ...formattedUniformItems];
console.log('Base catalog items without UN:', baseCatalog.length);
console.log('Injected uniform items:', formattedUniformItems.length);
console.log('Total catalog items:', newCatalog.length);

const catCounts = {};
newCatalog.forEach(i => {
  catCounts[i.categoria] = (catCounts[i.categoria] || 0) + 1;
});
console.log('Categories breakdown:', catCounts);

fs.writeFileSync(catalogPath, JSON.stringify(newCatalog, null, 2), 'utf8');
console.log('Successfully written catalogItems.json!');
