using Backend.Domain.Enums;

namespace Backend.Domain;

public class UserArea
{
    public Guid UserId { get; set; }

    public Area Area { get; set; }

    public User User { get; set; } = null!;
}