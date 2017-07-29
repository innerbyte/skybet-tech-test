use skybet-feed;

db.events.aggregate(
   [
        {
            $group: {
                _id: {
                    cat: "$cat",
                    sub_cat: "$sub_cat"
                    }
                }
        },
        {
            $sort: {
                "_id.sub_cat": 1,
                "_id.cat": 1
            }
        },
        {
            $group: {
                _id: "$_id.cat",
                sub_cats: {
                    $push: "$_id.sub_cat"
                }
            }
        }
   ]
)