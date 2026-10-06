using Backend.Domain.Enums;

namespace Backend.Application.DTOs.User;

public class UserDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string? ProfileImage { get; set; }

    public string? Bio { get; set; }

    public List<Area> Areas { get; set; } = [];
}