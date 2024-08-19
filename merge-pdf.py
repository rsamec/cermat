import os
from PyPDF2 import PdfMerger

def merge_pdfs(directory_paths, output_path):
    # Initialize a PDF Merger object
    merger = PdfMerger()

    # Iterate over all specified directories
    for directory in directory_paths:
        # Walk through the directory and find all PDF files
        for root, dirs, files in os.walk(directory):
            for file in files:
                if file.endswith('.pdf'):
                    pdf_path = os.path.join(root, file)
                    print(f"Adding {pdf_path}")
                    # Append the PDF to the merger object
                    merger.append(pdf_path)

    # Write out the merged PDF to the specified output file
    with open(output_path, 'wb') as output_file:
        merger.write(output_file)

    # Cleanup the merger object
    merger.close()
    print(f"PDFs merged into {output_path}")

# List of directories to search for PDFs
directory_paths = [
    'public/cz',    
]

# Output path for the merged PDF
output_path = 'generated/cz.pdf'

# Call the function to merge PDFs
merge_pdfs(directory_paths, output_path)
