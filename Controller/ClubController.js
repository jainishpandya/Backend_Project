const ClubModel = require('../Models/Club');
const MemberModel = require('../Models/Member');
const UserModel = require('../Models/User');

const createClub = async(req, res) => {
    try {
        const {club_name, club_contact_email, club_thumbnail_url, club_location} = req.body;
        const {admin_email, role_id} = req.body;

        const club = await ClubModel.findOne({club_name})

        if(club) {
            return res.status(409).json({message: "club with this name already exists", success: false});
        }

        const admin = await UserModel.findOne({user_email: admin_email})
        console.log(admin)
        if(!admin) {
            return res.status(409).json({message: "User with this email doesn't exist", success: false});
        } 

        // For Club Creation
        const clubModel = new ClubModel({club_name, club_contact_email, club_thumbnail_url, club_location});
        const ClubDocument = await clubModel.save();
        console.log(ClubDocument);
        // For Admin Addition
        const memberModel = new MemberModel({user_id: admin._id, club_id: ClubDocument._id,role: role_id});
        const MemberDocument = memberModel.save();

        res.status(201).json({
            message: "Club Creation Successful",
            success: true
        })
    } catch (error) {
        console.error('Club Creation Error: ', error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

const listClubs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) -1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";

        const clubs = await ClubModel.find({club_name: {$regex: search, $options: "i"}})
            .skip(page * limit)
            .limit(limit);
            
            const total = await ClubModel.countDocuments({
                club_name: {$regex: search, $options: "i"}
            })

            const response = {
                error: false,
                total,
                page: page + 1,
                limit,
                clubs
            }

            res.status(200).json(response)
    } catch (error) {
        console.error('Club Error: ', error);
        res.status(500).json({ message: 'server error' })
    }
}
    
module.exports = {
    createClub,
    listClubs
}


