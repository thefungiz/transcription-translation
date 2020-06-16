
curl -v --header "Content-Type: application/json" --data '{"DNA":"CGGGCTCTCT GGTACGTCTC CAGCGGAGAC CTTTTCCGGT"}'  localhost:8000/transcription

curl -v --header "Content-Type: application/json" --data '{"mRNA":"GCCCGAGAGACCAUGCAGAGGUCGCCUCUGGAAAAGGCCA"}'  localhost:8000/translation