console.log("Quiz Running");

let questions = {
    os: [
        {q:"Which is not OS?", o:["Windows", "Linux", "Oracle", "Mac"], a:3},
        {q:"Linux is a ", o:["OS","Database", "Network", "Compiler"], a:1},
        {q:"Process means?", o:["Program in execution", "File","Disk","Memory"], a:1},
        {q:"Kernel is?", o:["Hardware", "Core of OS", "Browser", "App"], a:2},
        {q:"Deadlock condition?", o:["No memory","Waiting forever","Virus", "Shutdown"], a:2},
        {q:"Booting means?", o:["Start computer","Stop computer", "Install OS", "Format disk"], a:1},
        {q:"GUI stands for?", o:["Graphical User Interface", "General Utility Input", "Graphical User Instruction","None"], a:1},
        {q:"Unix is written in?", o:["C","Java", "Python","Assembly"], a:1},
        {q:"Which is not type of OS?", o:["Batch", "Time sharing","Distributed", "Compiler"], a:4},
        {q:"Virtual memory is?", o:["Extra RAM", "Memory on disk","ROM", "Cache"], a:2},
        {q:"OS manages?", o:["Hardware", "Software", "Both", "None"], a:3},
        {q:"Round robin is?", o:["Scheduling algorithm", "Memory management", "Device driver", "File system"], a:1},
        {q:"Semaphore used for?", o:["Synchronization", "Compiling","Browsing", "Printing"], a:1},
        {q:"Fragmentation refers to?", o:["Memory waste", "CPU busy","Keyboard issue","None"], a:1},
        {q:"File extension for Windows executable?", o:[".exe",".txt",".doc",".img"], a:1},
        {q:"Linux command to list files?", o:["ls","list","show","dir"], a:1},
        {q:"Interrupt means?", o: ["Stop CPU", "Hardware signal", "Error", "Shutdown"], a:2},
        {q:"Swapping is?", o:["Switching processes","Printing data", "Running OS", "None"], a:1},
        {q:"Shell is?", o:["Command interpreter", "Virus", "RAM", "CPU"], a:1},
        {q:"Primary memory?", o:["RAM", "SSD","USB","DVD"], a:1}
    ],
    python: [
        {q:"Python creator?", o:["Guido","James", "Dennis", "Bjarne"], a:1},
        {q:"Extension of Python?", o:[".py",".pt",".p",".java"], a:1},
        {q:"Python is?", o:["Low level", "High level", "Machine","None"], a:2},
        {q:"Keyword?", o:["for","myvar","121x","!add"], a:1},
        {q:"List symbol?", o:["()","{}","[]", ""], a:3},
        {q:"Tuple symbol?", o:["[]","()","{}",""], a:2},
        {q:"Dictionary?", o:["key:value","list","tuple","set"], a:1},
        {q:"Python typed?", o:["Dynamically", "Statically", "Machine","None"], a:1},
        {q:"Floor division?", o:["//","/","%","*"], a:1},
        {q:"Function defined using?", o:["def", "fun","call","declare"], a:1},
        {q:"Loop keyword?", o:["for","var","if","try"], a:1},
        {q:"Break keyword?", o:["Exit loop", "Start loop", "Continue", "Pause"], a:1},
        {q:"Convert to int?", o:["int()","str()","float()","bool()"], a:1},
        {q:"Python used for?", o:["AI","Web","Automation", "All"], a:4},
        {q:"Comment symbol?", o:["#","//","/*","@"], a:1},
        {q:"Len() returns?", o:["Length","Sum","Min","Max"], a:1},
        {q:"Mutable type?", o:["List", "Tuple", "String", "None"], a:1},
        {q:"Immutable type?", o:["Tuple", "List","Dictionary","Set"], a:1},
        {q:"Indexing starts from?", o:["0","1","2","None"], a:1},
        {q:"Exception keyword?", o:["try","loop","print","range"], a:1}
    ],
    science: [
        {q:"H2O is?", o:["Water", "Salt","Sugar", "Gas"], a:1},
        {q:"Earth is?", o:["Star", "Planet", "Moon", "Comet"], a:2},
        {q:"Gas in air?", o:["02","CO2","N2","All"], a:4},
        {q:"Plant makes food?", o:["Photosynthesis", "Cooking", "Breathing", "Sleeping"], a:1},
        {q:"Energy from sun?", o:["Solar", "Steam","Wind", "Electric"], a:1},
        {q:"Human heart chambers?", o:["4","2","3","5"], a:1},
        {q:"Boiling of water?", o:["100°C", "50°C", "200°C", "90°C"], a:1},
        {q:"Gas for breathing?", o: ["Oxygen","CO2", "Nitrogen", "Helium"], a:1},
        {q:"Largest planet?", o:["Earth","Mars", "Jupiter", "Venus"], a:3},
        {q:"Acid in stomach?", o:["HCI","H2SO4","HNO3","CO2"], a:1},
        {q:"Blood color is?", o:["Red","Blue", "Green","White"], a:1},
        {q:"Sound unit?", o:["Decibel", "Meter", "Second", "Watt"], a:1},
        {q:"Sun rises from?", o:["East", "West", "North","South"], a:1},
        {q:"Atom is?", o:["Smallest unit", "Gas", "Metal", "Cell"], a:1},
        {q:"Pure water pH?", o:["7","5","9","10"], a:1},
        {q:"Gas used in bulbs?", o:["Argon", "Oxygen", "Hydrogen","Nitrogen"], a:1},
        {q:"Heart pumps?", o:["Blood","Air","Water", "Acid"], a:1},
        {q:"Virus causes?", o:["Disease", "Food", "Energy", "Metal"], a:1},
        {q:"Milk contains?", o:["Calcium","Iron","Gold","Coal"], a:1},
        {q:"Force formula?", o:["F=ma", "A=bc", "v=u+t", "P=mv"], a:1}
    ],
    reasoning: [
        {q:"2,4,6,8,...?", o:["9","10","12","11"], a:2},
        {q:"Opposite of Cold?", o:["Hot", "Cool", "Ice","Warm"], a:1},
        {q:"Cube sides?", o:["4","6","8","12"], a:2},
        {q:"Clock numbers?", o:["10","11","12","13"], a:3},
        {q:"If 5+5=10 6+6=?", o:["11","12","10","15"], a:2},
        {q:"Next: 5,10,15,20,...?", o:["25","30","35","40"], a:1},
        {q:"Triangle sides?", o:["2","3","4","5"], a:2},
        {q:"Find odd: Cat, Dog, Tiger, Table", o:["Cat", "Dog", "Tiger", "Table"], a:4},
        {q:"5 squared?", o:["10","20","25","15"], a:3},
        {q:"Vowel?", o:["B","A","Z","X"], a:2},
        {q:"8+2*5?", o:["30","18","10","20"], a:2},
        {q:"Sequence: A,B,C,D,...", o:["E","F","Z","G"], a:1},
        {q:"7 days in?", o:["Month", "Week","Year","Decade"], a:2},
        {q:"Clock shape?", o: ["Square", "Circle", "Triangle", "Oval"], a:2},
        {q:"If today Monday, after 2 days?", o:["Wed", "Tue", "Fri","Sun"], a:1},
        {q:"Smallest number?", o:["0","1","2","3"], a:1},
        {q:"First month?", o:["Jan", "Feb","Mar", "Apr"], a:1},
        {q:"Sun rises in?", o:["East", "West", "North", "South"], a:1},
        {q:"Largest number?", o:["5","9","8","6"], a:2},
        {q:"Shape with 4 sides?", o:["Square", "Line", "Dot", "Circle"], a:1}
    ],
    ds: [
        {q:"DS full form?", o:["Data Struct","Data Structure", "Drive Source","None"], a:2},
        {q:"Stack works on?", o:["FIFO","LIFO","LILO","None"], a:2},
        {q:"Queue works on?", o:["FIFO","LIFO","LILO", "None"], a:1},
        {q:"Binary tree root level?", o:["0","1","2","3"], a:1},
        {q:"Linked list stores?", o:["Nodes", "Table", "Matrix", "Cell"], a:1},
        {q:"Array index starts at?", o:["0","1","2","3"], a:1},
        {q:"DFS stands for?", o:["Depth First Search", "Data File System", "Disk Format", "None"], a:1},
        {q:"BFS stands for?", o:["Breadth First Search", "Binary Full Search", "Block File","None"], a:1},
        {q:"Queue example?", o:["Line","Stack", "Table", "Circle"], a:1},
        {q:"Stack example?", o:["Plates", "Queue", "Bus stand","Tree"], a:1},
        {q:"Tree structure is?", o:["Hierarchical", "Linear", "Circular","None"], a:1},
        {q:"Binary tree max children?", o:["2","3","4","1"], a:1},
        {q:"Linked list pointer points to?", o:["Next node", "Array", "CPU", "RAM"], a:1},
        {q:"Queue remove from?", o:["Front","Back","Middle", "Random"], a:1},
        {q:"Stack remove from?", o:["Top","Bottom", "Random", "Middle"], a:1},
        {q:"Searching DS?", o:["Tree", "Array", "Linked list","All"], a:4},
        {q:"Sorting means?", o: ["Arrange data", "Delete data", "Merge data", "None"], a:1},
        {q:"Queue insert at?", o:["Rear", "Front", "Top", "Head"], a:1},
        {q:"Hashing stores?", o:["Key-value", "Tree", "Array", "Stack"], a:1},
        {q:"Graph contains?", o:["Nodes & Edges","Files", "Tables", "Stack"], a:1}
    ]
};

let selectedSubject, index = 0, score = 0;

function startQuiz() {
    selectedSubject = document.getElementById("subjectSelect").value;
    if (!selectedSubject) {
        alert("Select a subject first!");
        return;
    }
    document.getElementById("startArea").classList.add("hide");
    document.getElementById("quizArea").classList.remove("hide");
    loadQuestion();
}

function loadQuestion() {
    let q = questions[selectedSubject][index];
    document.getElementById("questionText").innerText = (index+1)+". "+q.q;
    document.getElementById("opt1").innerText = "1) "+q.o[0];
    document.getElementById("opt2").innerText = "2) "+q.o[1];
    document.getElementById("opt3").innerText = "3) "+q.o[2];
    document.getElementById("opt4").innerText = "4) "+q.o[3];
}

function selectOption(option) {
    if(option == questions[selectedSubject][index].a) {
        score++;
    }
    nextQuestion();
}

function nextQuestion() {
    index++;
    if(index >= questions[selectedSubject].length) {
        submitQuiz();
    } else {
        loadQuestion();
    }
}

function submitQuiz() {
    document.getElementById("quizArea").classList.add("hide");
    document.getElementById("resultArea").classList.remove("hide");
    document.getElementById("scoreText").innerText = "Your Score: " + score + "/" + questions[selectedSubject].length;
}