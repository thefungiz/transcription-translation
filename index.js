const express = require("express");
const bodyParser = require("body-parser");
const app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || "8000";

const transcriptMap = new Map(JSON.parse('[["A","U"],["C","G"],["T","A"],["G","C"],[" ",""]]'))
const transcribe = input => {
    let res = ''; 
    input.replace(/\s/g,'').split('').forEach(it => {
        const seq = transcriptMap.get(it);
        res += seq ? seq : `(${it})`
    }); 
    return res;};
const translateMap = new Map(JSON.parse('[["AAA","Lysine"],["AUA","Isoleucine"],["ACA","Threonine"],["AGA","Arginine"],["AAU","Asparagine"],["AUU","Isoleucine"],["ACU","Threonine"],["AGU","Serine"],["AAC","Asparagine"],["AUC","Isoleucine"],["ACC","Threonine"],["AGC","Serine"],["AAG","Lysine"],["AUG","Initiation Codon / Methionine"],["ACG","Threonine"],["AGG","Arginine"],["UAA","Stop Codon"],["UUA","Leucine"],["UCA","Serine"],["UGA","Stop Codon"],["UAU","Tyrosine"],["UUU","Phenylalanine"],["UCU","Serine"],["UGU","Cysteine"],["UAC","Tyrosine"],["UUC","Phenylalanine"],["UCC","Serine"],["UGC","Cysteine"],["UAG","Stop Codon"],["UUG","Leucine"],["UCG","Serine"],["UGG","Tryptophan"],["CAA","Glutamine"],["CUA","Leucine"],["CCA","Proline"],["CGA","Arginine"],["CAU","Histidine"],["CUU","Leucine"],["CCU","Proline"],["CGU","Arginine"],["CAC","Histidine"],["CUC","Leucine"],["CCC","Proline"],["CGC","Arginine"],["CAG","Glutamine"],["CUG","Leucine"],["CCG","Proline"],["CGG","Arginine"],["GAA","Glutamic Acid"],["GUA","Valine"],["GCA","Alanine"],["GGA","Glycine"],["GAU","Aspartic Acid"],["GUU","Valine"],["GCU","Alanine"],["GGU","Glycine"],["GAC","Aspartic Acid"],["GUC","Valine"],["GCC","Alanine"],["GGC","Glycine"],["GAG","Glutamic Acid"],["GUG","Valine"],["GCG","Alanine"],["GGG","Glycine"]]'))
const translate = input => {
    const stripped = input.replace(/\s/g,'');
    let index = stripped.indexOf('AUG');
    let stopFound = false;
    const result = [];
    while (index < stripped.length && !stopFound) {
        const codon = stripped.substring(index, index + 3);
        if (['UAG', 'UGA', 'UAA'].includes(codon)) {
            stopFound = true;
        } else {
            const aminoAcid = translateMap.get(codon);
            result.push(aminoAcid ? aminoAcid : `(${codon})`);
        }
        index += 3;
    }
    return result;
}

app.post("/transcription/", (req, res) => {
    if (!req.body.DNA) res.status(400).send();
    else {
        const mRNA = transcribe(req.body.DNA);
        res.status(200).send({mRNA});
    }
});

app.post("/translation/", (req, res) => {
    if (!req.body.mRNA) res.status(400).send();
    else {
        const aminoAcids = translate(req.body.mRNA);
        res.status(200).send({aminoAcids});
    }
});

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});