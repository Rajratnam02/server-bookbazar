import categorymodel from "../models/categorymodel.js";

export const CreateCategory = async (req,res)=>{
    try {
        let {name,description,image} = req.body;
        let existing = await categorymodel.findOne({name});
        if(existing)
        {
            return res.status(400).json({message:"Category already exist"});
        }
        let CreatedCategory = await categorymodel.create({
            name,
            description,
            image,
        });
        res.status(201).json({message:"Category created successfully",data:CreatedCategory});
    }
    catch (error){
        return res.status(500).json({
            message: "Error creating category",
            error: error.message,
        })
    }
}

export const GetCategory = async (req,res)=>{
    try {
        let categories = await categorymodel.find({});
        res.status(200).json({
            message:"Categories fetched successfully",
            data:categories,
        })
    }
    catch (error){
        return res.status(500).json({
            message: "Error fetching categories",
            error: error.message,
        })
    }
}

export const UpdateCategory = async (req,res)=>{
    try{
        let id = req.params.id;
        let {name,description,image} = req.body;
        let existing = await categorymodel.findById(id);
        if(!existing)
        {
            return res.status(404).json({message:"Category not found"});
        }
        if(name)
        {
            let check = await categorymodel.findOne({name:name.trim().toLowerCase()});
            if(check && check._id.toString() !== id)
            {
                return res.status(400).json({message:"Category already exist"});
            }
            existing.name = name.trim().toLowerCase();
        }
        if(description) existing.description = description;
        if(image) existing.image= image;
        await existing.save();
        res.status(200).json({message:"Category updated successfully",data:existing});
    }
    catch (error){
        return res.status(500).json({
            message: "Error updating category",
            error: error.message,
            });
    }
}

export const DeleteCategory = async (req,res)=>{
    try{
        let id = req.params.id;
        let existing = await categorymodel.findById(id);
        if(!existing)
        {
            return res.status(404).json({message:"Category not found"});
        }
        await existing.deleteOne();
        res.status(200).json({message:"Category deleted successfully"});
    }
    catch(error){
        return res.status(500).json({
            message: "Error deleting category",
            error: error.message,
        });
    }
}



export const categories = [
  {
    name: "Science Fiction",
    description: "Explore futuristic worlds, alien life, and space adventures.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Fantasy",
    description:
      "Dive into magical worlds full of wizards, dragons, and epic quests.",
    image:
      "https://images.unsplash.com/photo-1544939574-58a460de0471?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Romance",
    description: "Heartwarming tales of love, passion, and connection.",
    image:
      "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Mystery",
    description: "Follow thrilling whodunits, crime stories, and secrets.",
    image:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Thriller",
    description: "Fast-paced plots filled with suspense and excitement.",
    image:
      "https://images.unsplash.com/photo-1510511233900-1982b9d4d6f4?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Biography",
    description: "Inspiring stories from the lives of real people.",
    image:
      "https://images.unsplash.com/photo-1590080875964-0260f6829a9f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Self-Help",
    description: "Improve your life with motivational and practical advice.",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "History",
    description: "Discover the stories that shaped the world.",
    image:
      "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Philosophy",
    description: "Explore life's biggest questions and ideas.",
    image:
      "https://images.unsplash.com/photo-1505666284218-5f82f27c0b33?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Psychology",
    description: "Understand how the human mind works.",
    image:
      "https://images.unsplash.com/photo-1588776814546-ec9cf594f1cb?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Travel",
    description: "Explore the world through captivating journeys.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Cooking",
    description: "Savor delicious recipes and culinary secrets.",
    image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Health & Fitness",
    description: "Stay strong with wellness and fitness advice.",
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc01f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Poetry",
    description: "Beautiful verses capturing emotions and imagination.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Comics",
    description: "Engaging stories told through vibrant illustrations.",
    image:
      "https://images.unsplash.com/photo-1589820296151-bc3bd7e92b1d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Children's Books",
    description: "Fun, colorful, and educational reads for kids.",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Young Adult",
    description: "Relatable stories for teens and young adults.",
    image:
      "https://images.unsplash.com/photo-1555529771-35a38fa6a4cb?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Business",
    description: "Learn strategies, leadership, and startup success.",
    image:
      "https://images.unsplash.com/photo-1603575448363-6cb3f5c75e1c?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Art & Design",
    description: "Get inspired by creativity and visual aesthetics.",
    image:
      "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Education",
    description: "Empower learning with knowledge and innovation.",
    image:
      "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=600&q=80",
  },
];


  
  

export const seedCategories = async (req, res) => {
  try {
    let created = [];
    let skipped = [];

    for (const category of categories) {
      const exists = await categorymodel.findOne({ name: category.name });
      if (!exists) {
        await categorymodel.create(category);
        created.push(category.name);
      } else {
        skipped.push(category.name);
      }
    }

    return res.status(201).json({
      message: "Category seeding complete.",
      created,
      skipped,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while seeding categories",
      error: error.message,
    });
  }
};