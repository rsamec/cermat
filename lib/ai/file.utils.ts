const fs = require('fs');


class FileSaver {
  constructor(private path: string) {

  }
  // Function to save JSON to a file
  private saveJSONToFile(data: Record<string, any>) {
    fs.writeFileSync(this.path, JSON.stringify(data, null, 2), 'utf-8');
    //console.log(`Data saved to file. ${this.path}`);
  }

  // Function to read JSON from a file
  private readJSONFromFile() {
    if (fs.existsSync(this.path)) {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data);
    } else {
      console.log(`File does not exist. Creating new file. ${this.path}`);
      return {};
    }
  }

  // Function to update JSON in the file
  updateJSONFile(key: string, value: any) {
    // Read the existing data
    const data = this.readJSONFromFile();

    // Update the data with new key-value pair
    data[key] = { ...data[key], ...value };

    // Save the updated data back to the file
    this.saveJSONToFile(data);
  }
}

export class QuizAnswerFileSaver extends FileSaver {
  constructor({ model }: { model: string }) {
    super(`./generated/quiz-answers-${model}.json`);
  }
}

export class QuizResultsFileSaver extends FileSaver {
  constructor({ model }: { model: string }) {
    super(`./generated/quiz-results-${model}.json`);
  }
}

export class QuizCategoriesFileSaver extends FileSaver {
  constructor({ model }: { model: string }) {
    super(`./generated/quiz-categories-${model}.json`);
  }
}
export class QuizTagsFileSaver extends FileSaver {
  constructor({ model }: { model: string }) {
    super(`./generated/quiz-tags-${model}.json`);
  }
}