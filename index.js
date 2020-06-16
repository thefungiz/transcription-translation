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
const translateMap = new Map(JSON.parse('[["AAA","Lys"],["AUA","Ile"],["ACA","Thr"],["AGA","Arg"],["AAU","Asn"],["AUU","Ile"],["ACU","Thr"],["AGU","Ser"],["AAC","Asn"],["AUC","Ile"],["ACC","Thr"],["AGC","Ser"],["AAG","Lys"],["AUG","Met"],["ACG","Thr"],["AGG","Arg"],["UAA","Stop Codon"],["UUA","Leu"],["UCA","Ser"],["UGA","Stop Codon"],["UAU","Tyr"],["UUU","Phe"],["UCU","Ser"],["UGU","Cys"],["UAC","Tyr"],["UUC","Phe"],["UCC","Ser"],["UGC","Cys"],["UAG","Stop Codon"],["UUG","Leu"],["UCG","Ser"],["UGG","Trp"],["CAA","Gln"],["CUA","Leu"],["CCA","Pro"],["CGA","Arg"],["CAU","His"],["CUU","Leu"],["CCU","Pro"],["CGU","Arg"],["CAC","His"],["CUC","Leu"],["CCC","Pro"],["CGC","Arg"],["CAG","Gln"],["CUG","Leu"],["CCG","Pro"],["CGG","Arg"],["GAA","Glu"],["GUA","Val"],["GCA","Ala"],["GGA","Gly"],["GAU","Asp"],["GUU","Val"],["GCU","Ala"],["GGU","Gly"],["GAC","Asp"],["GUC","Val"],["GCC","Ala"],["GGC","Gly"],["GAG","Glu"],["GUG","Val"],["GCG","Ala"],["GGG","Gly"]]'));
const translate = input => {
    const stripped = input.replace(/\s/g,'');
    let index = stripped.indexOf('AUG');
    let stopFound = false;
    let result = '';
    while (index < stripped.length && !stopFound) {
        const codon = stripped.substring(index, index + 3);
        if (['UAG', 'UGA', 'UAA'].includes(codon)) {
            stopFound = true;
        } else {
            const aminoAcid = translateMap.get(codon);
            if (result.length > 0) {
                result += ' ';
            }
            result += aminoAcid ? aminoAcid : `(${codon})`;
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